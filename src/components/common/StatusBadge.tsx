interface StatusBadgeProps {
  status: "SUCCESS" | "FAILED" | "PENDING" | string;
}

const statusMap: Record<string, string> = {
  SUCCESS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  FAILED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusMap[status] ?? "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"}`}>
      {status}
    </span>
  );
}