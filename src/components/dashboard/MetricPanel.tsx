interface MetricPanelProps {
  label: string;
  value: string;
  hint?: string;
}

export function MetricPanel({ label, value, hint }: MetricPanelProps) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-soft">
      <p className="text-sm text-sf-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-sf-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-sf-muted">{hint}</p> : null}
    </article>
  );
}