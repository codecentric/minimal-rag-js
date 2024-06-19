import fs from "node:fs"

export function getEvaluationResult(testName: string) {
  return getEvaluationDataFile(`evaluation-result-${testName}`)
}

const getEvaluationDataFile = (fileName: string) => {
  const fileContent = fs.readFileSync(
    `evaluation/data/${fileName}.json`,
    "utf-8",
  )
  return JSON.parse(fileContent)
}
