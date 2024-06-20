export function evaluateExecutionTime(testDataSet) {
  return {
    criteria: "executionTime",
    question: testDataSet.question,
    answer: testDataSet.answer,
    score: testDataSet.executionTimeInSeconds,
  }
}
