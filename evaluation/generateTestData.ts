import { initializeRagChain } from "../ragChain"
import { getAndVerifyCLIParameter, getQuestions, writeTestResult } from "./util"

const datasetName = getAndVerifyCLIParameter()

async function generateTestData() {
  const questions = getQuestions()
  const chain = await initializeRagChain("./data")

  const testData = []
  for (const { question, groundTruth } of questions) {
    console.log("Requesting answer for question: " + question)
    const start = Date.now()
    const { answer, context } = await chain.invoke(question)
    const end = Date.now()

    testData.push({
      question,
      groundTruth,
      answer,
      context,
      executionTimeInSeconds: (end - start) / 1000,
    })
  }
  writeTestResult(datasetName, testData)
}

generateTestData()
