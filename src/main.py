import os
import pinecone
from apify import Actor
from langchain.document_loaders import ApifyDatasetLoader
from langchain.document_loaders.base import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.text_splitter import CharacterTextSplitter

async def main():
    async with Actor:
        # Get the value of the actor input
        actor_input = await Actor.get_input() or {}

        print("Loading dataset");
        loader = ApifyDatasetLoader(
            dataset_id=actor_input.get('payload')['resource']['defaultDatasetId'],
            dataset_mapping_function=lambda dataset_item: Document(
                page_content=dataset_item["text"], metadata={"source": dataset_item["url"]}
            ),
        )
        print("Dataset loaded");

        print("Loading documents");
        documents = loader.load()
        print("Documents loaded");

        print("Splitting documents");
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = text_splitter.split_documents(documents)
        print("Documents split");

        PINECONE_API_KEY = actor_input.get('pinecone_token')
        PINECONE_ENV = actor_input.get('pinecone_env')

        print("Initializing pinecone");
        pinecone.init(
            api_key=PINECONE_API_KEY,  # find at app.pinecone.io
            environment=PINECONE_ENV  # next to api key in console
        )
        print("Pinecone initialized");

        index_name = actor_input.get("index_name")

        embeddings = OpenAIEmbeddings()
        print("Creating index");
        Pinecone.from_documents(docs, embeddings, index_name=index_name)
        print("Index created");

