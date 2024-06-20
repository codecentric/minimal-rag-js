import { loadEvaluator } from "langchain/evaluation"

// Is the answer correct based on the ground truth (factually-based answer?)

export async function evaluateCorrectness({ question, answer, groundTruth }) {
  const evaluator = await loadEvaluator("labeled_criteria", {
    criteria: "correctness",
  })
  const evaluation = await evaluator.evaluateStrings({
    input: question,
    prediction: answer,
    reference: groundTruth,
  })
  return evaluation.score
}
