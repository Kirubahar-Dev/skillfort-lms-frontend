import { useState } from "react";

export default function MockInterviewPage() {
  const [started, setStarted] = useState(false);
  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Mock Interview</h1>
      {!started ? (
        <div className="mt-6 grid gap-3 rounded-2xl border p-5 dark:border-white/10 md:grid-cols-2">
          <select className="rounded-lg border p-2 bg-transparent"><option>DSA</option><option>System Design</option><option>HR</option></select>
          <select className="rounded-lg border p-2 bg-transparent"><option>Easy</option><option>Medium</option><option>Hard</option><option>Mixed</option></select>
          <select className="rounded-lg border p-2 bg-transparent"><option>5 Questions</option><option>10 Questions</option><option>15 Questions</option></select>
          <select className="rounded-lg border p-2 bg-transparent"><option>60 minutes</option><option>45 minutes</option><option>90 minutes</option></select>
          <button className="md:col-span-2 rounded-lg bg-brand-primary py-3 text-white" onClick={() => setStarted(true)}>Start Mock Interview</button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border p-6 dark:border-white/10">Interview screen scaffold with progress/timer/answer workflow.</div>
      )}
    </div>
  );
}
