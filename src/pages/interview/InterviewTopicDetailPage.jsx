import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchInterviewTopic } from "../../services/interviewService";

export default function InterviewTopicDetailPage() {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    fetchInterviewTopic(slug).then(setTopic).catch(() => {
      setTopic({
        name: slug?.replaceAll("-", " "),
        description: "Topic details and interview relevance",
        patterns: ["Pattern 1", "Pattern 2", "Pattern 3"],
        questions: [{ id: 101, title: "Sample curated question", difficulty: "medium" }],
      });
    });
  }, [slug]);

  if (!topic) return <div className="container-wide py-12">Loading...</div>;

  return (
    <div className="container-wide py-12">
      <section className="rounded-2xl border p-6 dark:border-white/10">
        <h1 className="font-heading text-4xl font-bold">{topic.name}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{topic.description}</p>
      </section>

      <section className="mt-6 rounded-2xl border p-6 dark:border-white/10">
        <h2 className="font-heading text-2xl">Key Patterns</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2">{(topic.patterns || []).map((p) => <li key={p}>{p}</li>)}</ol>
      </section>

      <section className="mt-6 rounded-2xl border p-6 dark:border-white/10">
        <h2 className="font-heading text-2xl">Curated Questions</h2>
        <div className="mt-4 space-y-3">
          {(topic.questions || []).map((q) => (
            <article key={q.id} className="rounded-xl border p-3 dark:border-white/10">
              <p className="font-semibold">{q.title}</p>
              <p className="text-sm text-slate-500">Difficulty: {q.difficulty}</p>
              <div className="mt-2 flex gap-2">
                <Link className="rounded-lg border px-3 py-1 text-sm" to={`/interview-prep/questions/${q.id}/${q.slug}`}>Open Question</Link>
                <Link className="rounded-lg bg-brand-primary px-3 py-1 text-sm text-white" to="/interview-prep/compiler">Try in Compiler</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
