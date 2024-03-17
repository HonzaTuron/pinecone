import { ApifyDatasetLoader } from "langchain/document_loaders/web/apify_dataset";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { Actor } from 'apify';
import {CharacterTextSplitter} from "langchain/text_splitter";
import {Pinecone} from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone"

function getNestedValue(dataDict, keysStr) {
    const keys = keysStr.split('.');
    let result = dataDict;

    for (const key of keys) {
        if (key in result) {
            result = result[key];
        } else {
            // If any of the keys are not found, return null
            return null;
        }
    }

    return result;
}

await Actor.init();

const actorInput = await Actor.getInput();

const { index_name, metadata_fields, metadata_values, pinecone_token, pinecone_env, fields = [] } = actorInput;
const datasetId = actorInput?.payload?.resource?.defaultDatasetId || actorInput.dataset_id

if (!datasetId) {
    throw new Error("dataset_id is required");
}

for (const field of fields) {
    const loader = new ApifyDatasetLoader(datasetId, {
        datasetMappingFunction: (datasetItem) =>
            new Document({
                pageContent: getNestedValue(datasetItem, field),
                metadata: {
                    ...metadata_values,
                    ...Object.entries(metadata_fields).reduce(
                        (acc, [key, value]) => {
                            acc[key] = getNestedValue(datasetItem, value);
                            return acc;
                        }, {}
                    )
                },
            }),
    });

    console.log("Dataset loaded for field", field)

    console.log("Loading documents for field", field)

    const documents = await loader.load();

    console.log("Documents loaded")

    console.log("Splitting documents")

    const textSplitter = new CharacterTextSplitter({chunkSize: 1000, chunkOverlap: 0})

    const docs = await textSplitter.splitDocuments(documents)

    console.log("Documents split")

    console.log("Initializing Pinecone")

    const pinecone = new Pinecone({ apiKey: pinecone_token });
    const pineconeIndex = pinecone.index(index_name)

    try {
        await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
            index_name,
            maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
            pineconeIndex,
        });
    } catch (e) {
        const errorMessage = `Index creation failed: ${e}`
        console.log(errorMessage)
        await Actor.setStatusMessage(errorMessage)
        await Actor.fail()
    }
}
