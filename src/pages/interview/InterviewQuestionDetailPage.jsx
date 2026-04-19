import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchInterviewQuestion } from "../../services/interviewService";
import { fallbackQuestions } from "../../utils/mockData";
import InterviewCompilerPanel from "../../components/interview/InterviewCompilerPanel";

export default function InterviewQuestionDetailPage() {
  const { id, slug } = useParams();
  const [question, setQuestion] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchInterviewQuestion(id, slug);
        setQuestion(data);
      } catch {
        setQuestion(fallbackQuestions.find((q) => `${q.id}` === `${id}`) || fallbackQuestions[0]);
      }
    };
    load();
  }, [id, slug]);

  if (!question) return <div className="container-wide py-10">Loading...</div>;

  return (
    <div className="container-wide py-10">
      <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
        <section className="space-y-4">
          <p className="text-sm text-slate-500">Interview Prep &gt; {question.domain}</p>
          <h1 className="font-heading text-4xl font-bold">{question.title}</h1>
          <p className="text-slate-600 dark:text-slate-300">{question.body}</p>
          <button className="rounded-lg border px-3 py-2" onClick={() => setShowHint((s) => !s)}>Show hint</button>
          {showHint ? <div className="rounded-xl border p-3 dark:border-white/10">{question.hint}</div> : null}
          <button className="rounded-lg border px-3 py-2" onClick={() => setShowAnswer((s) => !s)}>Show full answer</button>
          {showAnswer ? <div className="rounded-xl border p-3 dark:border-white/10">{question.answer}</div> : null}
        </section>
        <InterviewCompilerPanel starterCode={question.boilerplate_py} testCases={question.test_cases || []} />
      </div>
    </div>
  );
}
