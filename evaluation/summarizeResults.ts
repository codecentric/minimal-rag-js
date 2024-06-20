import {
  averageOfField,
  getAndVerifyCLIParameter,
  getEvaluationResultFromFile,
} from "./util"

const datasetName = getAndVerifyCLIParameter()
const evaluationResults = getEvaluationResultFromFile(datasetName)

const critiques = [
  "correctness",
  "executionTime",
  "relevance",
  "languageLoyalty",
  "faithfulness",
]
critiques.forEach((criteria) => {
  const average = averageOfField(criteria, evaluationResults)
  console.log(`${criteria}: ${average.toFixed(3)}`)
})
