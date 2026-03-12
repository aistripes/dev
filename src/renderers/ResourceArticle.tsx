import type { ResourceArticle } from '../../schemas/resource-article';
import SchemaIcon from '../components/SchemaIcon';

interface Props {
  content: ResourceArticle;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

const potentialColors: Record<string, string> = {
  high: 'bg-blue-100 text-blue-800',
  medium: 'bg-purple-100 text-purple-800',
  standard: 'bg-gray-100 text-gray-700',
};

export default function ResourceArticle({ content }: Props) {
  const { seo, content: body } = content;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
          <SchemaIcon kind="resource-article" className="w-4 h-4" />
          <span>Resources</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{seo.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">{body.intro}</p>
      </header>

      <div className="space-y-10">
        {body.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {section.heading}
            </h2>
            <ol className="space-y-4">
              {section.items.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="text-2xl font-bold text-gray-200 select-none tabular-nums w-8 shrink-0 pt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.difficulty && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[item.difficulty]}`}>
                            {item.difficulty}
                          </span>
                        )}
                        {item.potential && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${potentialColors[item.potential]}`}>
                            {item.potential}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      {body.pro_tips.length > 0 && (
        <aside className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Pro Tips</h2>
          <ul className="space-y-3">
            {body.pro_tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm text-blue-800">
                <span className="text-blue-400 shrink-0">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
