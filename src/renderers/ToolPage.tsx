import { useMemo, useState } from 'react';
import type { ToolPage } from '../../schemas/tool-page';

interface Props {
  content: ToolPage;
}

type InputValue = string | number | boolean;
type RunnerOutput = string | number | boolean | Record<string, unknown> | Array<unknown>;
type Runner = (input: Record<string, InputValue>) => RunnerOutput;
type RunDelivery = Extract<ToolPage['content']['delivery'], { mode: 'run' }>;

function toInputValue(raw: unknown, type: ToolPage['content']['inputs'][number]['type']): InputValue {
  if (type === 'checkbox') {
    return Boolean(raw);
  }
  if (type === 'number') {
    if (typeof raw === 'number') return raw;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof raw === 'string') return raw;
  return '';
}

function sanitizeSchemaObject(value: unknown, options: Record<string, InputValue>): unknown {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeSchemaObject(entry, options));
  }

  const record = value as Record<string, unknown>;
  const cloned: Record<string, unknown> = {};

  for (const [key, rawChild] of Object.entries(record)) {
    if (
      options.strip_meta_keywords &&
      ['$schema', '$defs', '$id', 'default', 'examples'].includes(key)
    ) {
      continue;
    }
    if (options.remove_additional_properties && key === 'additionalProperties') {
      continue;
    }

    const child = sanitizeSchemaObject(rawChild, options);
    cloned[key] = child;
  }

  if (
    options.convert_const_to_enum &&
    Object.prototype.hasOwnProperty.call(cloned, 'const') &&
    !Object.prototype.hasOwnProperty.call(cloned, 'enum')
  ) {
    cloned.enum = [cloned.const];
    delete cloned.const;
  }

  return cloned;
}

const toolRunnerRegistry: Record<string, Runner> = {
  'structured-output-json-schema-sanitizer': (input) => {
    const rawSchema = String(input.schema_json ?? '');
    if (!rawSchema.trim()) {
      return { error: 'Input JSON Schema is required.' };
    }

    try {
      const parsed = JSON.parse(rawSchema) as unknown;
      const sanitized = sanitizeSchemaObject(parsed, input);
      return sanitized as Record<string, unknown>;
    } catch {
      return { error: 'Invalid JSON. Please paste a valid JSON schema object.' };
    }
  },
  'rag-context-window-calculator': (input) => {
    const modelContext = Number(input.model_context_tokens ?? 0);
    const reserved = Number(input.reserved_tokens ?? 0);
    const chunkSize = Number(input.chunk_size_tokens ?? 0);
    const overlapPercent = Number(input.chunk_overlap_percent ?? 0);
    const topK = Number(input.top_k ?? 0);

    const available = Math.max(0, modelContext - reserved);
    const overlapRatio = Math.min(Math.max(overlapPercent / 100, 0), 0.95);
    const effectiveChunk = Math.max(1, Math.round(chunkSize * (1 - overlapRatio)));
    const retrievalTokens = Math.max(0, effectiveChunk * Math.max(0, topK));
    const delta = available - retrievalTokens;

    return {
      retrieval_tokens: retrievalTokens,
      fits_context: delta >= 0,
      headroom_tokens: delta >= 0 ? delta : 0,
      overflow_tokens: delta < 0 ? Math.abs(delta) : 0,
      note: delta >= 0 ? 'Configuration fits context budget.' : 'Reduce top_k or chunk size.',
    };
  },
  'nextjs-metadata-validator': (input) => {
    const title = String(input.title ?? '').trim();
    const description = String(input.description ?? '').trim();
    const canonical = String(input.canonical_url ?? '').trim();
    const ogImage = String(input.og_image_url ?? '').trim();
    const noindex = Boolean(input.noindex);

    const checks = [
      {
        check: 'Title length',
        status: title.length >= 20 && title.length <= 65 ? 'pass' : 'warn',
        detail: `Current: ${title.length} chars`,
      },
      {
        check: 'Description length',
        status: description.length >= 120 && description.length <= 160 ? 'pass' : 'warn',
        detail: `Current: ${description.length} chars`,
      },
      {
        check: 'Canonical URL',
        status: /^https:\/\/[^ ]+$/i.test(canonical) ? 'pass' : 'warn',
        detail: canonical || 'Missing canonical URL',
      },
      {
        check: 'Open Graph image',
        status: ogImage.length > 0 ? 'pass' : 'warn',
        detail: ogImage.length > 0 ? 'Present' : 'Missing',
      },
      {
        check: 'Indexing',
        status: noindex ? 'warn' : 'pass',
        detail: noindex ? 'Page is marked noindex' : 'Page is indexable',
      },
    ];

    return checks;
  },
};

function renderOutput(value: RunnerOutput, type: RunDelivery['output']['type']) {
  if (type === 'text' || type === 'score') {
    return <p className="text-sm text-gray-800">{String(value)}</p>;
  }

  if (type === 'list' && Array.isArray(value)) {
    return (
      <ul className="space-y-2">
        {value.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-800 border border-gray-200 rounded-md p-2 bg-white">
            {typeof item === 'object' ? <pre className="whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre> : String(item)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <pre className="text-xs sm:text-sm bg-white border border-gray-200 rounded-lg p-3 overflow-auto">
      {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
    </pre>
  );
}

export default function ToolPageRenderer({ content }: Props) {
  const { seo, content: body } = content;
  const initialState = useMemo(
    () =>
      Object.fromEntries(
        body.inputs.map((input) => [input.name, input.type === 'checkbox' ? false : input.type === 'number' ? 0 : ''])
      ) as Record<string, InputValue>,
    [body.inputs]
  );

  const [formState, setFormState] = useState<Record<string, InputValue>>(initialState);
  const [output, setOutput] = useState<RunnerOutput | null>(null);
  const [runnerMessage, setRunnerMessage] = useState<string>('');

  const onRunTool = () => {
    if (body.delivery.mode !== 'run') return;
    const runner = toolRunnerRegistry[seo.slug];
    if (!runner) {
      setRunnerMessage('Interactive runner not yet implemented for this tool. Use examples and guidance below.');
      setOutput(null);
      return;
    }
    setRunnerMessage('');
    setOutput(runner(formState));
  };

  const applyExample = (exampleInput: Record<string, string | number | boolean>) => {
    const next = { ...formState };
    for (const input of body.inputs) {
      if (Object.prototype.hasOwnProperty.call(exampleInput, input.name)) {
        next[input.name] = toInputValue(exampleInput[input.name], input.type);
      }
    }
    setFormState(next);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
          <span>Tools</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 capitalize">{body.tool_type}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{seo.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">{body.description}</p>
      </header>

      {body.delivery.mode === 'run' ? (
        <section className="mb-8 border border-gray-200 rounded-xl p-5 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Try the tool</h2>
            <span className="text-xs text-gray-500 uppercase tracking-wide">{body.delivery.runner} runner</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {body.inputs.map((input) => (
              <label key={input.name} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">{input.label}</span>
                {input.type === 'textarea' ? (
                  <textarea
                    value={String(formState[input.name] ?? '')}
                    onChange={(e) => setFormState((prev) => ({ ...prev, [input.name]: e.target.value }))}
                    placeholder={input.placeholder}
                    className="min-h-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : input.type === 'select' ? (
                  <select
                    value={String(formState[input.name] ?? '')}
                    onChange={(e) => setFormState((prev) => ({ ...prev, [input.name]: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {(input.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : input.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={Boolean(formState[input.name])}
                    onChange={(e) => setFormState((prev) => ({ ...prev, [input.name]: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type={input.type === 'number' ? 'number' : input.type === 'url' ? 'url' : 'text'}
                    value={String(formState[input.name] ?? '')}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        [input.name]: input.type === 'number' ? Number(e.target.value || 0) : e.target.value,
                      }))
                    }
                    placeholder={input.placeholder}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </label>
            ))}
          </div>
          <button
            onClick={onRunTool}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Run tool
          </button>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{body.delivery.output.label}</h3>
            {runnerMessage ? (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">{runnerMessage}</p>
            ) : output !== null ? (
              renderOutput(output, body.delivery.output.type)
            ) : (
              <p className="text-sm text-gray-500">Run the tool to see output.</p>
            )}
          </div>
        </section>
      ) : (
        <section className="mb-8 border border-gray-200 rounded-xl p-5 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Useful tools and references</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {body.delivery.links.map((link) => (
              <a
                key={`${link.url}-${link.label}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">{link.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{link.kind}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1 truncate">{link.url}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {body.examples.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Examples</h2>
          <div className="space-y-3">
            {body.examples.map((example, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-medium text-gray-800">{example.label}</h3>
                  {body.delivery.mode === 'run' && (
                    <button
                      onClick={() => applyExample(example.input)}
                      className="text-xs px-2 py-1 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Use example
                    </button>
                  )}
                </div>
                <pre className="text-xs bg-gray-50 border border-gray-200 rounded-md p-2 overflow-auto">
                  {JSON.stringify(example.input, null, 2)}
                </pre>
                {example.expected_output && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Expected output</p>
                    <pre className="text-xs bg-emerald-50 border border-emerald-200 rounded-md p-2 overflow-auto">
                      {example.expected_output}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="border border-gray-200 rounded-xl p-5 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">How it works</h2>
        <p className="text-gray-700 leading-relaxed">{body.how_it_works}</p>
      </section>

      {body.related_tools && body.related_tools.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Related tools</h2>
          <div className="flex flex-wrap gap-2">
            {body.related_tools.map((tool) => (
              <a
                key={tool}
                href={`/tools/${tool}/`}
                className="text-sm px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-blue-300 text-gray-700 hover:text-blue-700 transition-colors"
              >
                {tool}
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
