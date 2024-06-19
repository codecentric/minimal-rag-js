import * as fs from "node:fs"
import { initializeRagChain } from "../ragChain"

const datasetName = process.argv[2]
if (!datasetName) {
  console.log("Missing mandatory second CLI parameter (dataset name)")
  process.exit()
}

async function generateTestData() {
  const questionsAsText = fs.readFileSync(
    "evaluation/data/questions.json",
    "utf8",
  )
  const questions = JSON.parse(questionsAsText)

  const chain = await initializeRagChain("./data")
  const testData = []
  for (const { question, answer } of questions) {
    console.log("requesting answer for question: " + question)
    const start = Date.now()
    const { response, context } = await chain.invoke(question)
    const end = Date.now()
    testData.push({
      question: question,
      groundTruth: answer,
      answer: response,
      context: context,
      executionTimeInSeconds: (end - start) / 1000,
    })
  }
  fs.writeFileSync(
    `evaluation/data/test-data-${datasetName}.json`,
    JSON.stringify(testData, null, 2),
  )
}

generateTestData()
