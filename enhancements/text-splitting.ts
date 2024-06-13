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
import { run } from "@backroad/backroad"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { Document } from "langchain/document"
import { VectorStore } from "@langchain/core/vectorstores"
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

async function loadFiles(path: string): Promise<Document[]> {
  const loader = new DirectoryLoader(path, {
    ".pdf": (path) => new PDFLoader(path),
  })
  return loader.load()
}

async function splitDocuments(docs: Document[]): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  })
  return splitter.splitDocuments(docs)
}

async function initializeVectorDatabase(
  documents: Document[],
): Promise<VectorStore> {
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  })
  return HNSWLib.fromDocuments(documents, embeddings)
}

async function initializeRagChain(filePath: string): Promise<RunnableSequence> {
  const docs = await loadFiles(filePath)
  const splittedDocs = await splitDocuments(docs)
  const vectorStore = await initializeVectorDatabase(splittedDocs)
  const retriever = vectorStore.asRetriever()
  const prompt =
    PromptTemplate.fromTemplate(`Answer the question based only on the following context:
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
  ])
}

function startChatUI(askRAG: Function) {
  run(async (br) => {
    const messages = br.getOrDefault("messages", [
      { by: "ai", content: "Wie kann ich dir helfen?" },
    ])
    br.write({ body: `# Chatte mit deinen Dokumenten \n---` })

    messages.forEach((message) => {
      br.chatMessage({ by: message.by }).write({ body: message.content })
    })

    const input = br.chatInput({ id: "input" })
    if (input) {
      const response = await askRAG(input)
      br.setValue("messages", [
        ...messages,
        { by: "human", content: input },
        { by: "ai", content: response },
      ])
    }
  })
}

const main = async () => {
  const chain = await initializeRagChain("./data")
  startChatUI((input: string) => chain.invoke(input))
}
main()
