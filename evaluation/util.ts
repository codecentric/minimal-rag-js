import fs from "node:fs"

export function getAndVerifyCLIParameter(): string {
  const datasetName = process.argv[2]
  if (!datasetName) {
    console.log("Missing mandatory second CLI parameter (dataset name)")
    process.exit()
  }
  return datasetName
}

export function averageOfField(field: string, list: object[]): number {
  return average(list.map((e) => e[field]))
}

export function average(list: number[]) {
  return list.reduce((a, b) => a + b, 0) / list.length
}

export function getQuestionsFromFile() {
  return getEvaluationFile("questions")
}

export function getEvaluationResultFromFile(testName: string) {
  return getEvaluationFile(`evaluation-result-${testName}`)
}

export function writeEvaluationResultToFile(testName: string, content: any) {
  return writeToEvaluationFile(`evaluation-result-${testName}`, content)
}

export function getTestResultFromFile(testName: string) {
  return getEvaluationFile(`test-data-${testName}`)
}

export function writeTestResultToFile(testName: string, content: any) {
  return writeToEvaluationFile(`test-data-${testName}`, content)
}

const writeToEvaluationFile = (fileName: string, content: any) => {
  fs.writeFileSync(
    `evaluation/data/${fileName}.json`,
    JSON.stringify(content, null, 2),
  )
}

const getEvaluationFile = (fileName: string) => {
  const fileContent = fs.readFileSync(
    `evaluation/data/${fileName}.json`,
    "utf-8",
  )
  return JSON.parse(fileContent)
}
