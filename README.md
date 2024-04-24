# Pinecone integration

The Apify Pinecone integration seamlessly transfers selected data from Apify Actors to a Pinecone.

Is there anything you find unclear or missing? Please don't hesitate to inform us by creating an issue.

⚠️ **Note**: This Actor is meant to be used together with other Actors' integration section.
For instance, if you are using the [Website Content Crawler](https://apify.com/apify/website-content-crawler),
you can enable Pinecone integration to store vectors in Pinecone.

For more information how to leverage vector stores in Apify platform, see a detailed blog post [what Pinecone is and why you should use it with your LLMs](https://blog.apify.com/what-is-pinecone-why-use-it-with-llms/).

## Description

The Pinecone-integration is designed to compute and store vectors from other Actors' data. It uses langchain
to interact with `OpenAI` and `Pinecone`.

1. Get `dataset_id` from an `Apify Actor` output (passed automatically via integration).
2. Get dataset using `Apify SDK`.
3. [Optional] Split text data into chunks using `langchain`'s `RecursiveCharacterTextSplitter` (you can specify `chunk_size`, `chunk_overlap`)
4. Compute embeddings using `OpenAI`
5. Save data into `Pinecone`

## Before you start

To utilize this integration, ensure you have:

- An OpenAI account and an OpenAI API token. Create a free account at [OpenAI](https://beta.openai.com/).
- `Pinecone` database (`pinecone_token`).


## Inputs

For details refer to [input schema](.actor/input_schema.json).

- `index_name`: Pinecone index name
- `pinecone_token`: Pinecone token
- `openai_token` - OpenAI API token.
- `fields` - Array of fields you want to save. For example, if you want to push `name` and `user.description` fields, you should set this field to `["name", "user.description"]`.
- `metadata_values` - Object of metadata values you want to save. For example, if you want to push `url` and `createdAt` values to Pinecone, you should set this field to `{"url": "https://www.apify.com", "createdAt": "2021-09-01"}`.
- `metadata_fields` - Object of metadata fields you want to save. For example, if you want to push `url` and `createdAt` fields, you should set this field to `{"url": "url", "createdAt": "createdAt"}`. If it has the same key as `metadata_values`, it's replaced.
- `chunk_size` - The maximum character length of each text chunk
- `chunk_overlap` - The character overlap between text chunks that are next to each other

Fields `fields`, `metadata_values`, and `metadata_fields` supports dot notation. For example, if you want to push `name` field from `user` object, you should set `fields` to `["user.name"]`.

## Outputs

This integration will save the selected fields from your Actor to your a Pinecone database.

## Want to talk to other devs or get help?

Join our [developer community on Discord](https://discord.com/invite/jyEM2PRvMU) to connect with other users and discuss this and other integrations.

## Need data for your LLMs?

You can also use the Apify platform to [gather data for your large language models](https://apify.com/data-for-generative-ai). We have Actors to ingest entire websites automatically.
Gather customer documentation, knowledge bases, help centers, forums, blog posts, and other sources of information to train or prompt your LLMs.
Integrate Apify into your product and let your customers upload their content in minutes.
