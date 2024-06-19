import { loadEvaluator } from "langchain/evaluation"
import { AzureChatOpenAI } from "@langchain/openai"
import * as fs from "node:fs"
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama"

const datasetName = process.argv[2]
if (!datasetName) {
  console.log("Missing mandatory second CLI parameter (dataset name)")
  process.exit()
}

async function evaluateCorrectness(testDataSet) {
  const model = new AzureChatOpenAI()
  const evaluator = await loadEvaluator("labeled_criteria", {
    criteria: "correctness",
    llm: model,
  })
  const correctnessResult = await evaluator.evaluateStrings({
    input: testDataSet.question,
    prediction: testDataSet.answer,
    reference: testDataSet.groundTruth,
  })
  return {
    criteria: "correctness",
    question: testDataSet.question,
    answer: testDataSet.answer,
    context: testDataSet.context,
    groundTruth: testDataSet.groundTruth,
    score: correctnessResult.score,
    reasoning: correctnessResult.reasoning,
  }
}

async function evaluateRelevance(testDataSet) {
  const model = new AzureChatOpenAI()
  const response = await model.invoke(
    `Generate 10 Questions which could have been asked for the following answer. Separate each question only with 'XXX'. End each question with a '?'. \n answer:\n${testDataSet.answer}`,
  )
  const questions = response.content.toString().split("XXX")
  const evaluator = await loadEvaluator("embedding_distance", {
    embedding: new OllamaEmbeddings({
      model: "jina/jina-embeddings-v2-base-de",
    }),
  })
  const relevancies = []
  for (const question of questions) {
    const relevance = await evaluator.evaluateStrings({
      prediction: question,
      reference: testDataSet.question,
    })
    relevancies.push(relevance)
  }
  const averageRelevance =
    relevancies.map((r) => r.score).reduce((a, b) => a + b) / relevancies.length
  return {
    criteria: "relevance",
    question: testDataSet.question,
    answer: testDataSet.answer,
    syntheticQuestions: questions,
    score: averageRelevance,
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

const evaluate = async () => {
  const model = new AzureChatOpenAI()
  const testData = JSON.parse(
    fs.readFileSync(`evaluation/data/test-data-${datasetName}.json`, "utf8"),
  )
  const evaluationResults = []
  for (const dataSet of testData) {
    console.log(`Evaluation for ${dataSet.question}`)
    evaluationResults.push(await evaluateCorrectness(dataSet))
    evaluationResults.push(await evaluateRelevance(dataSet))
    evaluationResults.push(await evaluateLanguageLoyalty(dataSet))
    evaluationResults.push(evaluateExecutionTime(dataSet))
  }
  fs.writeFileSync(
    `evaluation/data/evaluation-result-${datasetName}.json`,
    JSON.stringify(evaluationResults, null, 2),
  )
}
evaluate()
