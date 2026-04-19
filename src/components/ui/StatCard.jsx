export default function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-2 font-heading text-2xl font-bold">{value}</p>
    </div>
  );
}
