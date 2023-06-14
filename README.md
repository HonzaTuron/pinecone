# Apify Pinecone integration

This Apify integration will allow you to push selected fields from Actor to Pinecone index of your choice. It will also create a new index if it doesn't exist yet.

## Requirements
For this integration to work, you need to have an account on [Pinecone](https://www.pinecone.io/). You can create a free account [here](https://www.pinecone.io/start-free/). You will also need to create an API token for your Pinecone account. You can do that in the [Pinecone console](https://www.pinecone.io/console/).

You also need account on [OpenAI](https://openai.com/). You can create a free account [here](https://beta.openai.com/). You will also need to create an API token for your OpenAI account. You can do that in the [OpenAI console](https://beta.openai.com/account/api-keys).

## Input
For your integration, following input fields are required:
- `fields` - Array of fields you want to push to Pinecone from your Actor. For example, if you want to push `name` and `description` fields, you should set this field to `["name", "description"]`.
- `pinecone_env` - Pinecone environment name
- `pinecone_token` - Pinecone API token
- `index_name` - Pinecone index name. If this index doesn't exist yet, it will be created.
- `openai_token` - OpenAI API token

## Usage
To use this integration, you need to add it to your Actor. You can do that by clicking on the `+` button in the integration section of your Actor and then selecting `Pinecone integration`. You can then configure the integration by filling in the required fields.

## Output
This integration will push selected fields from your Actor to Pinecone index of your choice. It will also create a new index if it doesn't exist yet.
