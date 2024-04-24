import { ApifyDatasetLoader } from "langchain/document_loaders/web/apify_dataset";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { Actor, log } from 'apify';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";
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

const { index_name, metadata_fields, metadata_values, pinecone_token, openai_token, fields = [], chunk_size, chunk_overlap } = actorInput;
const datasetId = actorInput?.payload?.resource?.defaultDatasetId || actorInput.dataset_id

if (!datasetId) {
    msg = "The input parameter dataset_id is required"
    Actor.fail(msg);
    throw new Error(msg);
}

for (const field of fields) {
    const loader = new ApifyDatasetLoader(datasetId, {
        datasetMappingFunction: (datasetItem) =>
            new Document({
                pageContent: getNestedValue(datasetItem, field),
                metadata: {
                    ...metadata_values,
                    ...Object.entries(metadata_fields || {}).reduce(
                        (acc, [key, value]) => {
                            acc[key] = getNestedValue(datasetItem, value);
                            return acc;
                        }, {}
                    )
                },
            }),
    });

    console.log("Loading documents from Apify for field", {field});
    const documents = await loader.load();

    console.log(`Split documents into chunks with chunkSize: ${chunk_size} and ${chunk_overlap}`);
    const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: chunk_size, chunkOverlap: chunk_overlap})
    const docs = await textSplitter.splitDocuments(documents)
    console.log(`Created ${docs.length} chunks.`);

    console.log("Initializing Pinecone");
    const pinecone = new Pinecone({ apiKey: pinecone_token });
    const pineconeIndex = pinecone.index(index_name)


    try {
        await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: openai_token }), {
            index_name,
            maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
            pineconeIndex,
        });
        console.log("Documents insert into Pinecone");

        await Actor.exit();
    } catch (e) {
        const errorMessage = `Index creation failed: ${e}`
        console.log(errorMessage);
        await Actor.setStatusMessage(errorMessage)
        await Actor.fail()
    }
}
