import { AzureChatOpenAI } from "@langchain/openai"
import { loadEvaluator } from "langchain/evaluation"

export async function evaluateFaithfulness({ answer, context }) {
  const statements = await generateMinimalStatementsFromAnswer(answer)
  const model = new AzureChatOpenAI()
  const criteria = {
    faithfulness:
      "Can the following statement directly be derived from the input?",
  }
  const evaluator = await loadEvaluator("criteria", {
    criteria,
    llm: model,
  })
  let overallFaithfulness = 0
  for (const statement of statements) {
    const faithfulness = await evaluator.evaluateStrings({
      input: context,
      prediction: statement,
    })
    if (faithfulness.score === 1) overallFaithfulness++
  }
  return {
    criteria: "faithfulness",
    score: overallFaithfulness / statements.length,
    syntheticStatements: statements,
    answer,
    context,
  }
}

export async function generateMinimalStatementsFromAnswer(answer: string) {
  const model = new AzureChatOpenAI()
  const response = await model.invoke(
    `Generate 5 minimal statements which can be directly derived from the following context. Separate each statement only with 'XXX'. The statements should be as clear as possible. \n CONTEXT: ${answer}`,
  )
  return response.content.toString().split("XXX")
}
