# Pinecone Integration

Integrate Apify Actors with Pinecone to seamlessly transfer and store data as vectors.

⚠️ **Important**: This Actor is intended for use alongside other Actors. For instance, when using the [Website Content Crawler](https://apify.com/apify/website-content-crawler), enable this integration to store data as vectors in Pinecone.

Explore how to utilize vector stores on the Apify platform by reading our blog post: [Understanding Pinecone and Its Importance for Your LLMs](https://blog.apify.com/what-is-pinecone-why-use-it-with-llms/).

## Description

This integration is designed to process and store data vectors from various Apify Actors. It interfaces with `OpenAI` and `Pinecone` through `langchain` to perform the following steps:

1. Retrieve Actor's dataset using `dataset_id` (automatically passed in integration).
2. Fetch the dataset using the `Apify SDK`.
3. [Optional] Segment text data into chunks with `langchain`'s `RecursiveCharacterTextSplitter` (parameters like `chunk_size` and `chunk_overlap` are customizable).
4. Compute embeddings via `OpenAI`.
5. Store the resulting vectors in `Pinecone`.

## Before You Start

Ensure you have the following prerequisites for this integration:

- An OpenAI account and API token. Sign up for a free account at [OpenAI](https://beta.openai.com/).
- A Pinecone database with a valid API KEY (`pinecone_token`).

## Inputs

Refer to the [input schema](.actor/input_schema.json) for detailed information:

- `index_name`: Name of the Pinecone index.
- `pinecone_token`: Your Pinecone access token (API KEY).
- `openai_token`: Your OpenAI API token.
- `fields` - Array of fields you want to save. For example, if you want to push `name` and `user.description` fields, you should set this field to `["name", "user.description"]`.
- `metadata_values` - Object of metadata values you want to save. For example, if you want to push `url` and `createdAt` values to Pinecone, you should set this field to `{"url": "https://www.apify.com", "createdAt": "2021-09-01"}`.
- `metadata_fields` - Object of metadata fields you want to save. For example, if you want to push `url` and `createdAt` fields, you should set this field to `{"url": "url", "createdAt": "createdAt"}`. If it has the same key as `metadata_values`, it's replaced.
- `chunk_size`: Maximum character length for each text chunk.
- `chunk_overlap`: Overlap in characters between consecutive text chunks.

Fields, `metadata_values`, and `metadata_fields` support dot notation for nested data.

## Outputs

This integration saves selected fields from your Actor's output into your Pinecone database.

## Community and Support

- Join our [developer community on Discord](https://discord.com/invite/jyEM2PRvMU) to connect with other developers and discuss integrations.
- Visit [Apify for data needs of your LLMs](https://apify.com/data-for-generative-ai) for tools to ingest comprehensive datasets from various sources, enriching your large language models.
