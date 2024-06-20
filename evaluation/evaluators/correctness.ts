import { AzureChatOpenAI } from "@langchain/openai"
import { loadEvaluator } from "langchain/evaluation"

export async function evaluateCorrectness({ question, answer, groundTruth }) {
  const model = new AzureChatOpenAI()
  const evaluator = await loadEvaluator("labeled_criteria", {
    criteria: "correctness",
    llm: model,
  })
  const evaluation = await evaluator.evaluateStrings({
    input: question,
    prediction: answer,
    reference: groundTruth,
  })
  return {
    criteria: "correctness",
    question,
    answer,
    groundTruth,
    score: evaluation.score,
    reasoning: evaluation.reasoning,
  }
}
