import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addCourseNote, getLearnCourse, submitQuiz, updateCourseProgress } from "../../services/studentService";

export default function LearnPage() {
  const { courseSlug } = useParams();
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const [quizAnswer, setQuizAnswer] = useState({});

  const load = () => getLearnCourse(courseSlug).then(setData).catch(() => setData(null));
  useEffect(() => { load(); }, [courseSlug]);

  if (!data) return <div>Loading...</div>;

  const course = data.course;
  const lessons = data.lessons || [];
  const firstVideo = lessons[0]?.video_url;

  const markComplete = async (lesson) => {
    const next = Math.min(100, (course.progress_percent || 0) + Math.ceil(100 / Math.max(1, lessons.length)));
    await updateCourseProgress(courseSlug, lesson.title, next);
    toast.success("Progress updated");
    load();
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    await addCourseNote(courseSlug, course.last_lesson || "General", note);
    setNote("");
    toast.success("Note saved");
    load();
  };

  const doQuizSubmit = async () => {
    const qs = data.quiz?.questions || [];
    let score = 0;
    qs.forEach((q) => {
      if (Number(quizAnswer[q.id]) === Number(q.answer)) score += 1;
    });
    await submitQuiz(courseSlug, score, qs.length);
    toast.success(`Quiz submitted: ${score}/${qs.length}`);
  };

  return (
    <div>
      <h1 className="font-heading text-4xl">Learning: {course.title}</h1>
      <div className="mt-4 grid gap-5 xl:grid-cols-[280px_1fr_320px]">
        <aside className="rounded-xl border p-3 dark:border-white/10">
          <p className="mb-2 font-semibold">Lessons</p>
          <div className="space-y-2 text-sm">
            {lessons.map((l) => (
              <button key={l.id} className="w-full rounded border p-2 text-left dark:border-white/10" onClick={() => markComplete(l)}>
                {l.title} {l.completed ? "?" : ""}
              </button>
            ))}
          </div>
        </aside>

        <main className="rounded-xl border p-3 dark:border-white/10">
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            {firstVideo ? <iframe title="Lesson video" src={firstVideo.replace("watch?v=", "embed/")} className="h-full w-full" allowFullScreen /> : null}
          </div>
          <p className="mt-3 text-sm">Progress: {course.progress_percent}%</p>

          <div className="mt-4">
            <h2 className="font-semibold">Notes</h2>
            <textarea className="mt-2 w-full rounded border p-2 bg-transparent" rows="4" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="mt-2 rounded bg-brand-primary px-3 py-2 text-white" onClick={saveNote}>Save Note</button>
            <div className="mt-3 space-y-2 text-sm">
              {(data.notes || []).map((n) => <div key={n.id} className="rounded border p-2 dark:border-white/10">{n.lesson_title}: {n.note_text}</div>)}
            </div>
          </div>
        </main>

        <aside className="rounded-xl border p-3 dark:border-white/10">
          <h2 className="font-semibold">Quiz</h2>
          <div className="mt-2 space-y-3 text-sm">
            {(data.quiz?.questions || []).map((q) => (
              <div key={q.id} className="rounded border p-2 dark:border-white/10">
                <p className="font-medium">{q.question}</p>
                <select className="mt-2 w-full rounded border p-2 bg-transparent" value={quizAnswer[q.id] ?? ""} onChange={(e) => setQuizAnswer({ ...quizAnswer, [q.id]: e.target.value })}>
                  <option value="">Select</option>
                  {q.options.map((op, i) => <option key={op} value={i}>{op}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button className="mt-3 rounded bg-brand-primary px-3 py-2 text-white" onClick={doQuizSubmit}>Submit Quiz</button>
        </aside>
      </div>
    </div>
  );
}
