import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MyInterviewPrepPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [mocks, setMocks] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/api/interview/bookmarks/my").then((r) => r.data.items || []).catch(() => []),
      api.get("/api/interview/mock/my").then((r) => r.data.items || []).catch(() => []),
    ]).then(([b, m]) => {
      setBookmarks(b);
      setMocks(m);
    });
  }, []);

  return (
    <div>
      <h1 className="font-heading text-4xl">My Interview Prep</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border p-4 dark:border-white/10">
          <h2 className="font-semibold">Bookmarked Questions</h2>
          <div className="mt-3 space-y-2 text-sm">
            {bookmarks.map((q) => <div key={q.id} className="rounded border p-2 dark:border-white/10">{q.title}</div>)}
          </div>
        </section>

        <section className="rounded-xl border p-4 dark:border-white/10">
          <h2 className="font-semibold">Mock Interview History</h2>
          <div className="mt-3 space-y-2 text-sm">
            {mocks.map((m) => <div key={m.id} className="rounded border p-2 dark:border-white/10">{m.domain} • Score: {m.score}/{m.total_q}</div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
