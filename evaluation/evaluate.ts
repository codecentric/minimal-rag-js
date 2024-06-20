import {
  getAndVerifyCLIParameter,
  getTestResultFromFile,
  writeEvaluationResultToFile,
} from "./util"
import { evaluateRelevance } from "./evaluators/relevance"
import { evaluateCorrectness } from "./evaluators/correctness"
import { evaluateLanguageLoyalty } from "./evaluators/languageLoyalty"
import { evaluateFaithfulness } from "./evaluators/faithfulness"

const datasetName = getAndVerifyCLIParameter()

const evaluate = async () => {
  const testData = getTestResultFromFile(datasetName)
  const evaluationResults = []
  for (const dataSet of testData) {
    console.log(`Evaluation for: ${dataSet.question}`)
    const correctness = await evaluateCorrectness(dataSet)
    const relevance = await evaluateRelevance(dataSet)
    const languageLoyalty = await evaluateLanguageLoyalty(dataSet)
    const faithfulness = await evaluateFaithfulness(dataSet)
    evaluationResults.push({
      correctness,
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
