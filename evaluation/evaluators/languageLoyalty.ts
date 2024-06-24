import { loadEvaluator } from "langchain/evaluation"

// Is answer and question in the same language?

export async function evaluateLanguageLoyalty({ question, answer }) {
  const criteria = {
    languageLoyalty: "Is the output in the same language as the input?",
  }
  const evaluator = await loadEvaluator("criteria", {
    criteria,
  })
  const languageResult = await evaluator.evaluateStrings({
    input: question,
    prediction: answer,
  })
  return languageResult.score
}
