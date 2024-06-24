import { initializeRagChain } from "./ragChain"
import {
  getAndVerifyCLIParameter,
  getQuestionsFromFile,
  writeTestResultToFile,
} from "./util"

const datasetName = getAndVerifyCLIParameter()

async function generateTestData() {
  const questions = getQuestionsFromFile()
  const chain = await initializeRagChain("./data")

  const testData = []
  for (const { question, groundTruth } of questions) {
    console.log("Requesting answer for question: " + question)
    const start = Date.now()
    const { answer, context } = await chain.invoke(question)
    const end = Date.now()

    testData.push({
      question,
      answer,
      groundTruth,
      context,
      executionTimeInSeconds: (end - start) / 1000,
    })
  }
  writeTestResultToFile(datasetName, testData)
}

generateTestData()
