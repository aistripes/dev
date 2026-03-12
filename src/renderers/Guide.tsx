import type { Guide } from '../../schemas/guide';

interface Props {
  content: Guide;
}

export default function Guide({ content }: Props) {
  const { seo, content: body } = content;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
          <span>Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{seo.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-4">{body.intro}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {body.estimated_time}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {body.steps.length} steps
          </span>
        </div>
      </header>

      {/* Prerequisites */}
      {body.prerequisites.length > 0 && (
        <aside className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-semibold text-amber-900 mb-2 text-sm">Prerequisites</h2>
          <ul className="space-y-1">
            {body.prerequisites.map((prereq, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-800">
                <span className="text-amber-400 shrink-0">✓</span>
                <span>{prereq}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Steps */}
      <div className="space-y-8">
        {body.steps.map((step) => (
          <section key={step.number} className="relative">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {step.number}
                </div>
                <div className="w-px flex-1 bg-gray-200 mt-2" />
              </div>
              <div className="flex-1 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{step.explanation}</p>

                {step.code && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
                    {step.code.filename && (
                      <div className="bg-gray-800 px-4 py-2 text-xs font-mono text-gray-400 border-b border-gray-700">
                        {step.code.filename}
                      </div>
                    )}
                    <pre className="bg-gray-900 p-4 overflow-x-auto">
                      <code className={`language-${step.code.language} text-sm text-gray-100`}>
                        {step.code.content}
                      </code>
                    </pre>
                  </div>
                )}

                {step.pitfalls && step.pitfalls.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-red-700 mb-1.5">⚠ Common Pitfalls</p>
                    <ul className="space-y-1">
                      {step.pitfalls.map((pitfall, i) => (
                        <li key={i} className="text-sm text-red-700 flex gap-2">
                          <span className="shrink-0">•</span>
                          <span>{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <section className="bg-green-50 border border-green-200 rounded-xl p-6 mt-2">
        <h2 className="font-semibold text-green-900 mb-2">What you built</h2>
        <p className="text-green-800 leading-relaxed">{body.conclusion}</p>
      </section>
    </article>
  );
}
