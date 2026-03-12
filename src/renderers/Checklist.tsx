'use client';

import { useState } from 'react';
import type { Checklist } from '../../schemas/checklist';

interface Props {
  content: Checklist;
}

const priorityStyles: Record<string, { badge: string; dot: string }> = {
  critical: { badge: 'bg-red-100 text-red-800', dot: 'bg-red-400' },
  recommended: { badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  optional: { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-300' },
};

export default function Checklist({ content }: Props) {
  const { seo, content: body } = content;

  const allItemIds = body.sections.flatMap((s) =>
    s.items.map((item) => `${s.heading}::${item.title}`)
  );

  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const total = allItemIds.length;
  const done = checked.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
          <span>Checklists</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{seo.title}</h1>
        <p className="text-gray-600 leading-relaxed">{body.intro}</p>
      </header>

      {/* Progress bar */}
      <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-500">
            {done} / {total} complete ({pct}%)
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="text-sm text-green-600 font-medium mt-2">
            ✓ All items complete!
          </p>
        )}
      </div>

      <div className="space-y-8">
        {body.sections.map((section) => {
          const sectionDone = section.items.filter(
            (item) => checked.has(`${section.heading}::${item.title}`)
          ).length;

          return (
            <section key={section.heading}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{section.heading}</h2>
                <span className="text-sm text-gray-500">
                  {sectionDone}/{section.items.length}
                </span>
              </div>
              <ul className="space-y-3">
                {section.items.map((item) => {
                  const id = `${section.heading}::${item.title}`;
                  const isChecked = checked.has(id);
                  const styles = priorityStyles[item.priority];

                  return (
                    <li
                      key={item.title}
                      className={`flex gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggle(id)}
                    >
                      <div className="flex items-center pt-0.5">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-medium text-sm ${isChecked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {item.title}
                          </p>
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${styles.badge}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
