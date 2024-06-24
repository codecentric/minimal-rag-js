import { average } from "../util"
import { loadEvaluator } from "langchain/evaluation"
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama"
import { AzureChatOpenAI } from "@langchain/openai"

// Was the answer relevant to the question?
// We check this by generating questions based on the answer and comparing the
// cosine distance between real question and the synthetic ones

export async function evaluateRelevance({ question, answer }) {
  const questions = await generateQuestionsFromAnswer(answer)
  const evaluator = await loadEvaluator("embedding_distance", {
    embedding: new OllamaEmbeddings({
      model: "jina/jina-embeddings-v2-base-de",
    }),
  })
  const relevances = []
  for (const syntheticQuestion of questions) {
    const relevance = await evaluator.evaluateStrings({
      prediction: syntheticQuestion,
      reference: question,
    })
    relevances.push(relevance.score)
  }
  return average(relevances)
}

export async function generateQuestionsFromAnswer(answer) {
  const model = new AzureChatOpenAI()
  const response = await model.invoke(
    `Generate 10 Questions which could have been asked for the following answer. Separate each question only with 'XXX'. End each question with a '?'. \n answer:\n${answer}`,
  )
  return response.content.toString().split("XXX")
}
