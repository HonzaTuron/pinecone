# What does the Apify Pinecone integration do?

Our Apify Pinecone integration allows you to directly push selected fields from your Apify Actors to a Pinecone index, simplifying data retrieval and enabling advanced data analysis operations. If the index doesn't exist yet, no worries - the integration will create a new one for you.

For more information about Pinecone, check out this explanation of [what Pinecone is and why you should use it with your LLMs](https://blog.apify.com/what-is-pinecone-why-use-it-with-llms/).

## Why use the Apify Pinecone integration?

Apify is a web scraping and automation platform that can extract data from any website. Pinecone is a vector database designed for machine learning applications that allows you to handle complex data types and perform similarity searches. Bridging these two platforms unlocks new possibilities for both devs and data scientists.

Here are some ideas to inspire you:
- Data indexing: use the integration for indexing scraped data from Apify, enabling fast retrieval and advanced searches.
- Real-time recommendations: build a real-time recommendation engine by indexing scraped product data in Pinecone.
- Content personalization: enhance user experience by feeding data from Apify into Pinecone for personalized content delivery.
- Predictive analysis: index data with predictive qualities in Pinecone for trend analysis with machine learning.
- AI chatbot training: index and retrieve conversational data with Pinecone to train AI chatbots effectively.

## What you need before you start

For this integration to work, you need to have:

- An account on Pinecone. You can create a free account at [Pinecone](https://www.pinecone.io/).
- An account on OpenAI. You can create a free account at [OpenAI](https://beta.openai.com/).
- API tokens for your Pinecone and OpenAI accounts, which you can generate in their respective consoles.

## Input

The following input fields are required for this integration:

- `fields` - Array of fields you want to push to Pinecone from your Actor. For example, if you want to push `name` and `description` fields, you should set this field to `["name", "description"]`.
- `metadata_values` - Object of metadata values you want to push to Pinecone from your Actor. For example, if you want to push `url` and `createdAt` values to Pinecone, you should set this field to `{"url": "https://www.apify.com", "createdAt": "2021-09-01"}`.
- `metadata_fields` - Object of metadata fields you want to push to Pinecone from your Actor. For example, if you want to push `url` and `createdAt` fields, you should set this field to `{"url": "url", "createdAt": "createdAt"}`. If it has the same key as `metadata_values`, it's replaced.
- `pinecone_env` - Pinecone environment name.
- `pinecone_token` - Pinecone API token.
- `index_name` - Pinecone index name.
- `openai_token` - OpenAI API token.

## Output

This integration will push selected fields from your Actor to your selected Pinecone index and will also create a new index if it doesn't already exist.

## 5 steps to get started with the Apify Pinecone integration

1. **Set up your accounts:** Create a free account on both Pinecone and OpenAI, if you don't have them already. You will also need to create an API token for your Pinecone and OpenAI accounts.

2. **Develop your Apify Actor:** Using Apify's open-source tools, develop your Actor with your favorite libraries. Apify works well with both Python and JavaScript and offers compatibility with libraries like Scrapy, Selenium, Playwright, or Puppeteer.

3. **Deploy your code to Apify:** Turn your code into an Apify Actor. Actors are serverless microapps that are easy to develop, run, share, and integrate. You can deploy to the cloud using a single CLI command or build directly from GitHub.

4. **Configure your Pinecone integration:** To use the Pinecone integration, you need to add it to your Actor. This can be done by clicking on the `+` button in the integration section of your Actor and then selecting `Pinecone integration`. Fill in the required fields which include `fields` (array of fields you want to push to Pinecone from your Actor), `pinecone_env` (Pinecone environment name), `pinecone_token` (Pinecone API token), `index_name` (Pinecone index name), and `openai_token` (OpenAI API token).

5. **Run and test your Actor:** Start your actor from the Apify Console, CLI, or via API. You can also schedule your Actor to start at any time. While running, your Actor will push selected fields from your Actor to your selected Pinecone index.

## Tips on using your Actor

- **Integration with other workflows:** You can connect your Actor to hundreds of other apps using our other ready-made integrations, or set up your own with webhooks and the Apify API.
- **Publish your Actor:** Once your Actor is working smoothly, you can choose to share it on Apify Store and potentially earn money from other users.

## Want to talk to other devs or get help?

Join our [developer community on Discord](https://discord.com/invite/jyEM2PRvMU) to connect with other users and discuss this and other integrations.

## Need data for your LLMs?

You can also use the Apify platform to [gather data for your large language models](https://apify.com/data-for-generative-ai). We have Actors to ingest entire websites automatically. Gather customer documentation, knowledge bases, help centers, forums, blog posts, and other sources of information to train or prompt your LLMs. Integrate Apify into your product and let your customers upload their content in minutes.
