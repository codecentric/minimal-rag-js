import { AzureChatOpenAI } from "@langchain/openai"
import { loadEvaluator } from "langchain/evaluation"

export async function evaluateLanguageLoyalty(testDataSet) {
  const model = new AzureChatOpenAI()
  const criteria = {
    languageLoyalty: "Is the output in the same language as the input?",
  }
  const evaluator = await loadEvaluator("criteria", {
    criteria,
    llm: model,
  })
  const languageResult = await evaluator.evaluateStrings({
    input: testDataSet.question,
    prediction: testDataSet.answer,
  })
  return languageResult.score
}
