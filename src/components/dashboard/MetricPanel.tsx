interface MetricPanelProps {
  label: string;
  value: string;
  hint?: string;
}

export function MetricPanel({ label, value, hint }: MetricPanelProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-soft dark:border-gray-700 dark:bg-gray-800/50 dark:shadow-none">
      <p className="text-sm text-sf-muted dark:text-gray-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-sf-ink dark:text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-sf-muted dark:text-gray-500">{hint}</p> : null}
    </article>
  );
}