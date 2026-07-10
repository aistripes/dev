import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLlmCost } from '../src/lib/self-hosted-llm-cost.mjs';

test('separates token classes and calculates workload breakeven', () => {
  const result = calculateLlmCost({ inputTokens: 100_000_000, outputTokens: 20_000_000, cachedTokens: 50_000_000, inputRate: 1, outputRate: 5, cachedRate: .1, infrastructure: 500, power: 50, opsHours: 8, opsRate: 100, other: 0 });
  assert.equal(result.monthlyApi, 205);
  assert.equal(result.monthlySelfHosted, 1350);
  assert.equal(result.workloadUnits, 1350 / 205);
});

test('returns no breakeven when API comparison cost is zero', () => {
  const result = calculateLlmCost({ inputTokens: 0, outputTokens: 0, cachedTokens: 0, inputRate: 0, outputRate: 0, cachedRate: 0, infrastructure: 10, power: 0, opsHours: 0, opsRate: 0, other: 0 });
  assert.equal(result.workloadUnits, null);
});
