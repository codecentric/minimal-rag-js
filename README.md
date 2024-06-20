# Simple RAG application

This demo application showcases a RAG-System in it's most simple form.

## Getting started

To start, you need to install the JS dependencies:
```bash
yarn install
```
Additionally install [ollama](https://ollama.com) and the used models:
```bash
ollama pull llama3
ollama pull nomic-embed-text
```

After installing these dependencies, start the ui:
```bash
yarn dev
```
and visit [your localhost](http://localhost:3333) to get access to the RAG-based chat.

## Enhancements

Some of the suggested enhancements are implemented in the `enhancements` directory. To run them, use the respective node script from `package.json`. E.g. run `yarn embeddings`
* **embeddings** Shows how a different embedding e.g. for german language could drastically improve the quality of the RAG-System
* **sources** Also print used sources to enable the user to see what documents were used
* **split** Improve input by splitting text into smaller chunks

## Evaluation

To evaluate the quality of the current RAG-Configuration a set of tools was provided.

### Prerequisites

For evaluation a strong LLM is needed to get the best results. Per default this implementation uses `Azure OpenAI` instances. To connect them, you need to locally add the file `azure.env` with the following content:
```bash
export AZURE_OPENAI_API_INSTANCE_NAME=<AZURE_REGION>
export AZURE_OPENAI_API_DEPLOYMENT_NAME=<AZURE_DEPLOYMENT>
export AZURE_OPENAI_API_KEY=<AZURE_AUTH_KEY> # One of either Key1 / Key2 from your azure openAI instance
export AZURE_OPENAI_API_VERSION="2024-02-01"
export AZURE_OPENAI_BASE_PATH=https://<AZURE_DOMAIN>/openai/deployments
```

### Start evaluating

1. Manually generate some test data and store them in `evaluations/data/questions.json`. This can be done with ChatGPT as described in the blog article. Alternatively simply use the questions provided.
2. Generate test data using the current RAG-Configuration: `yarn generate-test-data <name-of-test>`
3. Evaluate the quality of the RAG: `yarn evaluate <name-of-test>`
4. Check the results with: `yarn summarize <name-of-test>`

Evaluation criterias can be found under `evaluation/evaluators`

## Additional information

It was built using

- [LangChain (js)](https://js.langchain.com/v0.1/docs/get_started/introduction)
- [ollama (open source models)](https://ollama.com/)
- [backroad (chat ui)](https://backroad.sudomakes.art/)

