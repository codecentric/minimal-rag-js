import { formatDocumentsAsString } from "langchain/util/document"
import { PromptTemplate } from "@langchain/core/prompts"
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama"
import { ChatOllama } from "@langchain/community/chat_models/ollama"
import { DirectoryLoader } from "langchain/document_loaders/fs/directory"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { Document } from "langchain/document"
import { VectorStore } from "@langchain/core/vectorstores"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"

async function loadFiles(path: string): Promise<Document[]> {
  const loader = new DirectoryLoader(path, {
    ".pdf": (path) => new PDFLoader(path),
  })
  return loader.load()
}

async function initializeVectorDatabase(
  documents: Document[],
): Promise<VectorStore> {
  const embeddings = new OllamaEmbeddings({
    model: "jina/jina-embeddings-v2-base-de",
  })
  return HNSWLib.fromDocuments(documents, embeddings)
}

export async function initializeRagChain(
  filePath: string,
): Promise<RunnableSequence> {
  const docs = await loadFiles(filePath)
  const vectorStore = await initializeVectorDatabase(docs)
  const retriever = vectorStore.asRetriever()
  const prompt =
    PromptTemplate.fromTemplate(`You are an expert in Computer science. Answer the question based only on the following context. Always answer in the same language of the question. Answer concise and accurate.
    {context}
    Question: {question}`)
  const chatModel = new ChatOllama({
    model: "llama3",
  })

  return RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    chatModel,
    new StringOutputParser(),
    {
      context: retriever.pipe(formatDocumentsAsString),
      response: new RunnablePassthrough(),
    },
  ])
}
