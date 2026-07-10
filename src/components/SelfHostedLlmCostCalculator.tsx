import { useMemo, useState } from 'react';
import { calculateLlmCost } from '../lib/self-hosted-llm-cost.mjs';

const defaults = { inputTokens: 100_000_000, outputTokens: 20_000_000, cachedTokens: 0, inputRate: 1, outputRate: 5, cachedRate: 0.1, infrastructure: 500, power: 50, opsHours: 8, opsRate: 100, other: 0 };
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function SelfHostedLlmCostCalculator() {
  const [values, setValues] = useState(defaults);
  const result = useMemo(() => calculateLlmCost(values), [values]);
  const set = (key: keyof typeof defaults, value: string) => setValues((old) => ({ ...old, [key]: Math.max(0, Number(value) || 0) }));
  const field = (key: keyof typeof defaults, label: string, suffix?: string) => (
    <label className="block text-sm font-medium text-gray-800">{label}{suffix && <span className="font-normal text-gray-500"> {suffix}</span>}<input aria-label={label} type="number" min="0" step="any" value={values[key]} onChange={(e) => set(key, e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></label>
  );
  return <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 sm:p-7">
    <fieldset><legend className="text-lg font-bold text-gray-950">Monthly token workload</legend><div className="mt-4 grid gap-4 md:grid-cols-3">{field('inputTokens','Input tokens')}{field('outputTokens','Output tokens')}{field('cachedTokens','Cached input tokens')}</div></fieldset>
    <fieldset className="mt-7"><legend className="text-lg font-bold text-gray-950">API rates you want to compare</legend><p className="mt-1 text-sm text-gray-600">Enter dollars per one million tokens from a dated provider price sheet or invoice.</p><div className="mt-4 grid gap-4 md:grid-cols-3">{field('inputRate','Input rate','($/1M)')}{field('outputRate','Output rate','($/1M)')}{field('cachedRate','Cached-input rate','($/1M)')}</div></fieldset>
    <fieldset className="mt-7"><legend className="text-lg font-bold text-gray-950">Fully loaded self-hosting cost</legend><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{field('infrastructure','Infrastructure per month ($)')}{field('power','Power and network per month ($)')}{field('opsHours','Operations hours per month')}{field('opsRate','Loaded operations cost per hour ($)')}{field('other','Other monthly cost ($)')}</div></fieldset>
    <div aria-live="polite" className="mt-7 grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-3"><p><span className="block text-sm text-gray-500">Self-hosting total</span><strong className="text-2xl">{money.format(result.monthlySelfHosted)}</strong></p><p><span className="block text-sm text-gray-500">API cost for workload</span><strong className="text-2xl">{money.format(result.monthlyApi)}</strong></p><p><span className="block text-sm text-gray-500">Simple breakeven</span><strong className="text-2xl">{result.workloadUnits === null ? 'Set API rates' : `${result.workloadUnits.toFixed(2)}× workload`}</strong></p></div>
    <p className="mt-4 text-xs leading-5 text-gray-600"><strong>Method:</strong> API cost = input, output, and cached-input token costs calculated separately. Self-hosting = infrastructure + power/network + operations hours × loaded hourly cost + other. Breakeven is the multiple of this exact token mix where API cost equals self-hosting cost. It assumes equivalent output quality and excludes migration risk, taxes, discounts, reasoning-token differences, failed requests, and unused reserved capacity unless you include them above.</p>
  </div>;
}
