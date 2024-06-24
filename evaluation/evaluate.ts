import {
  getAndVerifyCLIParameter,
  getTestResultFromFile,
  writeEvaluationResultToFile,
} from "./util"
import { evaluateRelevance } from "./evaluators/relevance"
import { evaluateLanguageLoyalty } from "./evaluators/languageLoyalty"
import { evaluateFaithfulness } from "./evaluators/faithfulness"

const datasetName = getAndVerifyCLIParameter()

async function evaluate() {
  const testData = getTestResultFromFile(datasetName)
  const evaluationResults = []
  for (const dataSet of testData) {
    console.log(`Evaluation for: ${dataSet.question}`)
    const relevance = await evaluateRelevance(dataSet)
    const languageLoyalty = await evaluateLanguageLoyalty(dataSet)
    const faithfulness = await evaluateFaithfulness(dataSet)
    evaluationResults.push({
      relevance,
      languageLoyalty,
      faithfulness,
      executionTime: dataSet.executionTimeInSeconds,
      question: dataSet.question,
      answer: dataSet.answer,
      context: dataSet.context,
      groundTruth: dataSet.groundTruth,
    })
  }
  writeEvaluationResultToFile(datasetName, evaluationResults)
}

evaluate()
