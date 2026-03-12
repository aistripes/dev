import type { Comparison } from '../../schemas/comparison';
import SchemaIcon from '../components/SchemaIcon';

interface Props {
  content: Comparison;
}

export default function Comparison({ content }: Props) {
  const { seo, content: body } = content;

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
          <SchemaIcon kind="comparison" className="w-4 h-4" />
          <span>Comparisons</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{seo.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">{body.intro}</p>
      </header>

      {/* Option cards */}
      <div className={`grid gap-4 mb-10 ${body.options.length >= 3 ? 'grid-cols-1 sm:grid-cols-3' : body.options.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {body.options.map((option) => (
          <div key={option.name} className="border border-gray-200 rounded-xl p-4">
            <h2 className="font-semibold text-gray-900 mb-1">{option.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{option.tagline}</p>
            <p className="text-xs text-blue-600 font-medium">Best for: {option.best_for}</p>
            {option.url && (
              <a
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-gray-600 mt-1 block transition-colors"
              >
                {option.url.replace(/^https?:\/\//, '')} ↗
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mb-10 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-40">Criterion</th>
              {body.options.map((opt) => (
                <th key={opt.name} className="text-left px-4 py-3 font-semibold text-gray-700 min-w-48">
                  {opt.name}
                </th>
              ))}
              <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-32">Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {body.criteria.map((criterion) => (
              <tr key={criterion.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{criterion.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{criterion.description}</p>
                </td>
                {body.options.map((opt) => (
                  <td key={opt.name} className="px-4 py-3 text-gray-600">
                    {criterion.values[opt.name] ?? '—'}
                  </td>
                ))}
                <td className="px-4 py-3">
                  {criterion.winner && (
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      {criterion.winner}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verdict */}
      <section className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Verdict</h2>
        <p className="text-gray-700 leading-relaxed mb-6">{body.verdict.summary}</p>

        <h3 className="font-semibold text-gray-900 mb-3">Use-Case Recommendations</h3>
        <div className="space-y-3">
          {body.verdict.use_cases.map((uc) => (
            <div key={uc.scenario} className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-900 text-sm mb-0.5">
                Scenario: {uc.scenario}
              </p>
              <p className="text-blue-700 font-semibold text-sm mb-1">→ {uc.recommendation}</p>
              <p className="text-gray-500 text-sm">{uc.reason}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
