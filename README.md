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

## Additional information

It was built using

- [LangChain (js)](https://js.langchain.com/v0.1/docs/get_started/introduction)
- [ollama (open source models)](https://ollama.com/)
- [backroad (chat ui)](https://backroad.sudomakes.art/)

