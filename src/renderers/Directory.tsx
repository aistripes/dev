import type { Directory } from '../../schemas/directory';
import { useState } from 'react';

interface Props {
  content: Directory;
}

const pricingColors: Record<string, string> = {
  free: 'bg-green-100 text-green-800',
  freemium: 'bg-blue-100 text-blue-800',
  paid: 'bg-orange-100 text-orange-800',
  'open-source': 'bg-purple-100 text-purple-800',
  enterprise: 'bg-gray-100 text-gray-700',
};

export default function Directory({ content }: Props) {
  const { seo, content: body } = content;

  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});
  const [search, setSearch] = useState('');

  const toggleFilter = (dimension: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [dimension]: prev[dimension] === value ? null : value,
    }));
  };

  const filteredEntries = body.entries.filter((entry) => {
    const matchesSearch =
      search === '' ||
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesFilters = Object.entries(activeFilters).every(([dim, val]) => {
      if (!val) return true;
      const dimension = body.filter_dimensions.find((d) => d.name === dim);
      if (!dimension) return true;
      return entry.tags.includes(val) || entry.pricing_model === val.toLowerCase() || entry.category === val.toLowerCase();
    });

    return matchesSearch && matchesFilters;
  });

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
          <span>Directories</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{seo.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">{body.intro}</p>
      </header>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-wrap gap-4">
          {body.filter_dimensions.map((dim) => (
            <div key={dim.name} className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">{dim.name}:</span>
              {dim.values.map((val) => (
                <button
                  key={val}
                  onClick={() => toggleFilter(dim.name, val)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    activeFilters[dim.name] === val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredEntries.length} of {body.entries.length} entries
        </p>
      </div>

      {/* Entries grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.name}
            className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors bg-white"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-semibold text-gray-900">{entry.name}</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${pricingColors[entry.pricing_model]}`}>
                {entry.pricing_model}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{entry.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div>
                <p className="font-medium text-gray-700 mb-1">Pros</p>
                <ul className="space-y-0.5 text-gray-600">
                  {entry.pros.map((pro, i) => (
                    <li key={i} className="flex gap-1">
                      <span className="text-green-500 shrink-0">+</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Cons</p>
                <ul className="space-y-0.5 text-gray-600">
                  {entry.cons.map((con, i) => (
                    <li key={i} className="flex gap-1">
                      <span className="text-red-400 shrink-0">−</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {entry.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Visit ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <p className="text-center text-gray-400 py-16">No entries match your filters.</p>
      )}
    </article>
  );
}
