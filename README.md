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

## Additional information

It was built using

- LangChain (js)
- ollama (open source models)
- backroad (chat ui)

