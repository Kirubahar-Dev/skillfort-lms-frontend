import { useMemo, useState } from "react";

export default function StudyPlannerPage() {
  const [days, setDays] = useState(30);
  const [done, setDone] = useState({});
  const plan = useMemo(() => Array.from({ length: days }, (_, i) => i + 1), [days]);
  const complete = Object.keys(done).length;
  const percent = Math.round((complete / days) * 100);

  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Study Planner</h1>
      <div className="mt-4 flex gap-2">
        {[30, 60, 90].map((d) => <button key={d} onClick={() => { setDays(d); setDone({}); }} className={`rounded-lg border px-4 py-2 ${days === d ? "bg-brand-primary text-white" : ""}`}>{d} Days</button>)}
      </div>
      <p className="mt-4 text-sm">Completion: {percent}%</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {plan.map((day) => (
          <button key={day} onClick={() => setDone((x) => ({ ...x, [day]: !x[day] }))} className={`rounded-xl border p-4 text-left ${done[day] ? "border-emerald-400 bg-emerald-500/10" : "dark:border-white/10"}`}>
            <p className="font-semibold">Day {day}</p>
            <p className="text-sm text-slate-500">Solve 8 questions</p>
          </button>
        ))}
      </div>
    </div>
  );
}
