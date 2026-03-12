interface Props {
  kind: 'resource-article' | 'comparison' | 'resources' | 'comparisons';
  className?: string;
}

const iconPaths = {
  resources: (
    <>
      <rect x="4" y="6" width="8" height="12" rx="2" />
      <rect x="12" y="4" width="8" height="12" rx="2" />
      <path d="M8 9h1.5M8 12h1.5M16 8h1.5M16 11h1.5M16 14h1.5" />
    </>
  ),
  comparisons: (
    <>
      <path d="M7 6h10" />
      <path d="M12 6v12" />
      <path d="M5 10h4l-2 4-2-4Z" />
      <path d="M15 10h4l-2 4-2-4Z" />
      <path d="M9 18h6" />
    </>
  ),
} as const;

export default function SchemaIcon({ kind, className = 'h-5 w-5' }: Props) {
  const normalizedKind = kind === 'resource-article' ? 'resources' : kind === 'comparison' ? 'comparisons' : kind;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[normalizedKind]}
    </svg>
  );
}
