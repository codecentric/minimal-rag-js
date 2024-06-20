import {
  getAndVerifyCLIParameter,
  getTestResultFromFile,
  writeEvaluationResultToFile,
} from "./util"
import { evaluateRelevance } from "./evaluators/relevance"
import { evaluateCorrectness } from "./evaluators/correctness"
import { evaluateLanguageLoyalty } from "./evaluators/languageLoyalty"
import { evaluateFaithfulness } from "./evaluators/faithfulness"
import { evaluateExecutionTime } from "./evaluators/executionTime"

const datasetName = getAndVerifyCLIParameter()

const evaluate = async () => {
  const testData = getTestResultFromFile(datasetName)
  const evaluationResults = []
  for (const dataSet of testData) {
    console.log(`Evaluation for: ${dataSet.question}`)
    evaluationResults.push(await evaluateCorrectness(dataSet))
    evaluationResults.push(await evaluateRelevance(dataSet))
    evaluationResults.push(await evaluateLanguageLoyalty(dataSet))
    evaluationResults.push(await evaluateFaithfulness(dataSet))
    evaluationResults.push(evaluateExecutionTime(dataSet))
  }
  writeEvaluationResultToFile(datasetName, evaluationResults)
}

evaluate()
