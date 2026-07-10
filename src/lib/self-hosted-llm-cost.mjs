export function calculateLlmCost(input) {
  const monthlySelfHosted = input.infrastructure + input.power + input.opsHours * input.opsRate + input.other;
  const monthlyApi =
    (input.inputTokens / 1_000_000) * input.inputRate +
    (input.outputTokens / 1_000_000) * input.outputRate +
    (input.cachedTokens / 1_000_000) * input.cachedRate;
  const workloadUnits = monthlyApi > 0 ? monthlySelfHosted / monthlyApi : null;
  return { monthlySelfHosted, monthlyApi, workloadUnits };
}
