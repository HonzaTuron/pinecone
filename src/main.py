import os
import pinecone
from functools import reduce
from apify import Actor
from langchain.document_loaders import ApifyDatasetLoader
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.text_splitter import CharacterTextSplitter

def get_nested_value(data_dict, keys_str):
    keys = keys_str.split('.')
    result = data_dict

    for key in keys:
        if key in result:
            result = result[key]
        else:
            # If any of the keys are not found, return None
            return None

    return result


async def main():
    async with Actor:

        # Get the value of the actor input
        actor_input = await Actor.get_input() or {}

        os.environ['OPENAI_API_KEY'] = actor_input.get('openai_token')

        fields = actor_input.get('fields') or []
        metadata_fields = actor_input.get('metadata_fields') or {}
        metadata_values = actor_input.get('metadata_values') or {}

        PINECONE_API_KEY = actor_input.get('pinecone_token')
        PINECONE_ENV = actor_input.get('pinecone_env')

        print("Loading dataset")

        # Iterator over metadata fields
        for field in metadata_fields:
            metadata_fields[field] = get_nested_value(actor_input.get('payload')['resource'], metadata_fields[field])

        for field in fields:
            loader = ApifyDatasetLoader(
                dataset_id=actor_input.get('payload')['resource']['defaultDatasetId'],
                dataset_mapping_function=lambda dataset_item: Document(
                    page_content=get_nested_value(dataset_item, field),
                    metadata={**metadata_values, **{key: get_nested_value(dataset_item, value) for key, value in metadata_fields.items()}}
                )
            )
            print("Dataset loaded for field ", field)

            print("Loading documents for field ", field)
        
            documents = loader.load()
            print("Documents loaded")

            print("Splitting documents")
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
            docs = text_splitter.split_documents(documents)
            print("Documents split")

            print("Initializing pinecone")
            pinecone.init(
                api_key=PINECONE_API_KEY,  # find at app.pinecone.io
                environment=PINECONE_ENV  # next to api key in console
            )
            print("Pinecone initialized")

            index_name = actor_input.get("index_name")

            embeddings = OpenAIEmbeddings()
            print("Creating index")

            try:
                Pinecone.from_documents(docs, embeddings, index_name=index_name)
                print("Index created")
            except Exception as e:
                errorMessage = f"Index creation failed: {str(e)}"
                print(errorMessage)
                await Actor.set_status_message(errorMessage)
                await Actor.fail()
