import fs from "node:fs"
import { AzureChatOpenAI } from "@langchain/openai"

export function getAndVerifyCLIParameter(): string {
  const datasetName = process.argv[2]
  if (!datasetName) {
    console.log("Missing mandatory second CLI parameter (dataset name)")
    process.exit()
  }
  return datasetName
}

export async function generateQuestionsFromAnswer(answer) {
  const model = new AzureChatOpenAI()
  const response = await model.invoke(
    `Generate 10 Questions which could have been asked for the following answer. Separate each question only with 'XXX'. End each question with a '?'. \n answer:\n${answer}`,
  )
  return response.content.toString().split("XXX")
}

export function averageOfField(field: string, list: object[]): number {
  return list.map((e) => e[field]).reduce((a, b) => a + b, 0) / list.length
}

export function getQuestions() {
  return getEvaluationDataFile("questions")
}

export function getEvaluationResult(testName: string) {
  return getEvaluationDataFile(`evaluation-result-${testName}`)
}

export function writeEvaluationResult(testName: string, content: any) {
  return writeToEvaluationFile(`evaluation-result-${testName}`, content)
}

export function getTestResult(testName: string) {
  return getEvaluationDataFile(`test-data-${testName}`)
}

export function writeTestResult(testName: string, content: any) {
  return writeToEvaluationFile(`test-data-${testName}`, content)
}

const writeToEvaluationFile = (fileName: string, content: any) => {
  fs.writeFileSync(
    `evaluation/data/${fileName}.json`,
    JSON.stringify(content, null, 2),
  )
}

const getEvaluationDataFile = (fileName: string) => {
  const fileContent = fs.readFileSync(
    `evaluation/data/${fileName}.json`,
    "utf-8",
  )
  return JSON.parse(fileContent)
}
