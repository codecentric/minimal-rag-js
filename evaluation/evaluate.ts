import { loadEvaluator } from "langchain/evaluation"
import { AzureChatOpenAI } from "@langchain/openai"
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama"
import {
  averageOfField,
  generateQuestionsFromAnswer,
  getAndVerifyCLIParameter,
  getTestResult,
  writeEvaluationResult,
} from "./util"

const datasetName = getAndVerifyCLIParameter()

const evaluate = async () => {
  const testData = getTestResult(datasetName)
  const evaluationResults = []
  for (const dataSet of testData) {
    console.log(`Evaluation for ${dataSet.question}`)
    evaluationResults.push(await evaluateCorrectness(dataSet))
    evaluationResults.push(await evaluateRelevance(dataSet))
    evaluationResults.push(await evaluateLanguageLoyalty(dataSet))
    evaluationResults.push(evaluateExecutionTime(dataSet))
  }
  writeEvaluationResult(datasetName, evaluationResults)
}

async function evaluateCorrectness({ question, answer, groundTruth, context }) {
  const model = new AzureChatOpenAI()
  const evaluator = await loadEvaluator("labeled_criteria", {
    criteria: "correctness",
    llm: model,
  })
  const evaluation = await evaluator.evaluateStrings({
    input: question,
    prediction: answer,
    reference: groundTruth,
  })
  return {
    criteria: "correctness",
    question,
    answer,
    context,
    groundTruth,
    score: evaluation.score,
    reasoning: evaluation.reasoning,
  }
}

async function evaluateRelevance({ question, answer }) {
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
    relevances.push(relevance)
  }
  return {
    criteria: "relevance",
    question: question,
    answer: answer,
    syntheticQuestions: questions,
    score: averageOfField("score", relevances),
  }
}

function evaluateExecutionTime(testDataSet) {
  return {
    criteria: "executionTime",
    question: testDataSet.question,
    answer: testDataSet.answer,
    score: testDataSet.executionTimeInSeconds,
  }
}

async function evaluateLanguageLoyalty(testDataSet) {
  const model = new AzureChatOpenAI()
  const criteria = {
    languageLoyalty: "Is the output in the same language as the input?",
  }
  const evaluator = await loadEvaluator("criteria", {
    criteria,
    llm: model,
  })
  const languageResult = await evaluator.evaluateStrings({
    input: testDataSet.question,
    prediction: testDataSet.answer,
  })
  return {
    criteria: "languageLoyalty",
    question: testDataSet.question,
    answer: testDataSet.answer,
    score: languageResult.score,
    reasoning: languageResult.reasoning,
  }
}

evaluate()
