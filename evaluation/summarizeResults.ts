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
  const resultsOfCriteria = evaluationResults.filter(
    (r) => r.criteria === criteria,
  )
  const average = averageOfField("score", resultsOfCriteria)
  console.log(`${criteria}: ${average.toFixed(3)}`)
})
