export default function AdminSectionPage({ title, description }) {
  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">{title}</h1>
      <div className="mt-6 rounded-2xl border p-5 dark:border-white/10">
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </div>
  );
}
