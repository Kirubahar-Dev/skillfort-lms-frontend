import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCourses } from "../../services/studentService";

export default function MyCoursesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getMyCourses().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-4xl">My Courses</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((c) => (
          <article key={c.course_id} className="rounded-xl border p-4 dark:border-white/10">
            <img src={c.thumbnail} alt={c.title} className="h-36 w-full rounded-lg object-cover" />
            <h2 className="mt-3 font-semibold">{c.title}</h2>
            <p className="text-sm text-slate-500">Progress: {c.progress_percent}%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-2 rounded-full bg-brand-primary" style={{ width: `${c.progress_percent}%` }} />
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Link to={`/learn/${c.slug}`} className="rounded-lg bg-brand-primary px-3 py-2 text-sm text-slate-900">
                {c.progress_percent === 100 ? "Review" : "Continue"}
              </Link>
              {c.progress_percent === 100 && (
                <Link to={`/certificate/${c.course_id}`} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-300">
                  Certificate
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
