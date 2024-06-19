import { getEvaluationResult } from "./util"

const datasetName = process.argv[2]
if (!datasetName) {
  console.log("Missing mandatory second CLI parameter (dataset name)")
  process.exit()
}

const evaluationResults = getEvaluationResult(datasetName)

const critiques = [
  "correctness",
  "executionTime",
  "relevance",
  "languageLoyalty",
]
critiques.forEach((criteria) => {
  const resultsOfCriteria = evaluationResults.filter(
    (r) => r.criteria === criteria,
  )
  const average =
    resultsOfCriteria.map((r) => r.score).reduce((a, b) => a + b) /
    resultsOfCriteria.length
  console.log(`${criteria}: ${average.toFixed(3)}`)
})
