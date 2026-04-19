import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchInterviewTopics } from "../../services/interviewService";

export default function InterviewTopicsIndexPage() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchInterviewTopics().then((data) => setTopics(data.items || [])).catch(() => {
      setTopics([
        { slug: "dynamic-programming", name: "Dynamic Programming", domain: "DSA", difficulty: "Hard", count: 22 },
        { slug: "rest-api-design", name: "REST API Design", domain: "System Design", difficulty: "Medium", count: 14 },
      ]);
    });
  }, []);

  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Important Topics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <Link key={t.slug} to={`/interview-prep/topics/${t.slug}`} className="rounded-2xl border p-4 dark:border-white/10">
            <p className="text-xs text-brand-primary">{t.domain}</p>
            <h2 className="font-semibold">{t.name}</h2>
            <p className="text-sm text-slate-500">{t.count || 10} questions</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
