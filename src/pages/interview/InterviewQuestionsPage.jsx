import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchInterviewQuestions } from "../../services/interviewService";
import { fallbackQuestions } from "../../utils/mockData";

export default function InterviewQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({ page: 1, search: "", difficulty: "", domain: "", sort: "newest" });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchInterviewQuestions(filters);
        setQuestions(data.items || []);
        setTotal(data.total || 0);
      } catch {
        setQuestions(fallbackQuestions);
        setTotal(fallbackQuestions.length);
      }
    };
    load();
  }, [filters]);

  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Interview Questions</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border p-4 dark:border-white/10">
          <input placeholder="Search" className="w-full rounded-lg border p-2 bg-transparent" value={filters.search} onChange={(e) => setFilters({ ...filters, page: 1, search: e.target.value })} />
          <select className="mt-3 w-full rounded-lg border p-2 bg-transparent" value={filters.domain} onChange={(e) => setFilters({ ...filters, domain: e.target.value, page: 1 })}>
            <option value="">All Domains</option>
            <option>DSA</option>
            <option>System Design</option>
            <option>Python</option>
            <option>Java</option>
            <option>SQL</option>
            <option>Full Stack</option>
            <option>Cloud</option>
            <option>HR</option>
          </select>
          <select className="mt-3 w-full rounded-lg border p-2 bg-transparent" value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value, page: 1 })}>
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </aside>
        <section>
          <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
            <p>Showing {questions.length} of {total || "500+"} questions</p>
            <select className="rounded-lg border p-2 bg-transparent" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              <option value="newest">Newest</option>
              <option value="most_viewed">Most Viewed</option>
              <option value="most_bookmarked">Most Bookmarked</option>
              <option value="difficulty_easy">Easy first</option>
              <option value="difficulty_hard">Hard first</option>
            </select>
          </div>
          <div className="space-y-3">
            {questions.map((q) => (
              <article key={q.id} className="rounded-xl border p-4 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={q.difficulty === "easy" ? "badge-easy" : q.difficulty === "hard" ? "badge-hard" : "badge-medium"}>{q.difficulty}</span>
                  <span className="rounded-full bg-brand-primary/10 px-2 py-1 text-xs text-brand-primary">{q.domain}</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold">{q.title}</h2>
                <p className="mt-1 text-sm text-slate-500">Views: {q.views || 0}  Bookmarks: {q.bookmarks || 0}</p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/interview-prep/questions/${q.id}/${q.slug}`} className="rounded-lg border px-3 py-1 text-sm">Open</Link>
                  <Link to="/interview-prep/compiler" className="rounded-lg bg-brand-primary px-3 py-1 text-sm text-slate-900">Try in Compiler</Link>
                </div>
              </article>
            ))}
          </div>
          <button className="mt-6 rounded-lg border px-4 py-2" onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Load more</button>
        </section>
      </div>
    </div>
  );
}
