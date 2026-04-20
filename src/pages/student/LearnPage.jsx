import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addCourseNote, getLearnCourse, submitQuiz } from "../../services/studentService";
import { completeLesson, getCertificateInfo, getLessonProgress } from "../../services/learnService";

function VideoPlayer({ url }) {
  if (!url) return (
    <div className="flex h-full items-center justify-center bg-slate-900 rounded-xl">
      <p className="text-slate-400">No video for this lesson</p>
    </div>
  );
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
  const embedUrl = isYoutube
    ? url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/") + "?rel=0&modestbranding=1"
    : url;
  if (isYoutube) {
    return (
      <iframe
        key={url}
        src={embedUrl}
        className="h-full w-full rounded-xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Lesson video"
      />
    );
  }
  return <video key={url} src={url} controls className="h-full w-full rounded-xl bg-black" />;
}

export default function LearnPage() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [note, setNote] = useState("");
  const [quizAnswer, setQuizAnswer] = useState({});
  const [certInfo, setCertInfo] = useState(null);
  const [tab, setTab] = useState("video");

  const loadAll = async () => {
    try {
      const cd = await getLearnCourse(courseSlug);
      setCourseData(cd);
      if (cd?.course?.id) {
        const pd = await getLessonProgress(cd.course.id);
        setProgressData(pd);
        // Set first unlocked incomplete lesson as active
        const first = pd.lessons.find(l => l.unlocked && !l.completed) || pd.lessons[0];
        if (first && !activeLesson) setActiveLesson(first);
        // Check certificate
        try {
          const ci = await getCertificateInfo(cd.course.id);
          setCertInfo(ci);
        } catch (_) {}
      }
    } catch {
      toast.error("Unable to load course");
    }
  };

  useEffect(() => { loadAll(); }, [courseSlug]);

  const handleCompleteLesson = async () => {
    if (!activeLesson || activeLesson.completed) return;
    setCompleting(true);
    try {
      const res = await completeLesson(activeLesson.id);
      toast.success(`Lesson complete! Progress: ${res.progress_percent}%`);
      // Reload progress
      const pd = await getLessonProgress(courseData.course.id);
      setProgressData(pd);
      // Update active lesson state
      const updated = pd.lessons.find(l => l.id === activeLesson.id);
      if (updated) setActiveLesson(updated);
      // Auto advance to next lesson
      const nextIdx = pd.lessons.findIndex(l => l.id === activeLesson.id) + 1;
      if (nextIdx < pd.lessons.length && pd.lessons[nextIdx].unlocked) {
        setTimeout(() => setActiveLesson(pd.lessons[nextIdx]), 800);
      }
      // Refresh cert info
      try {
        const ci = await getCertificateInfo(courseData.course.id);
        setCertInfo(ci);
      } catch (_) {}
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to mark complete");
    } finally {
      setCompleting(false);
    }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    await addCourseNote(courseSlug, activeLesson?.lesson_title || "General", note);
    setNote("");
    toast.success("Note saved");
    loadAll();
  };

  const submitQuizAnswers = async () => {
    const qs = courseData?.quiz?.questions || [];
    let score = 0;
    qs.forEach(q => { if (Number(quizAnswer[q.id]) === Number(q.answer)) score++; });
    await submitQuiz(courseSlug, score, qs.length);
    toast.success(`Quiz: ${score}/${qs.length} correct`);
  };

  if (!courseData || !progressData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Loading course...</p>
        </div>
      </div>
    );
  }

  const course = courseData.course;
  const lessons = progressData.lessons || [];
  const pct = progressData.progress_percent || 0;

  // Group lessons by section
  const sections = lessons.reduce((acc, l) => {
    if (!acc[l.section_title]) acc[l.section_title] = [];
    acc[l.section_title].push(l);
    return acc;
  }, {});

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {/* Top progress bar */}
      <div className="flex items-center gap-4 border-b px-4 py-2 dark:border-white/10">
        <p className="text-sm font-semibold truncate max-w-xs">{course.title}</p>
        <div className="flex-1 rounded-full bg-slate-200 dark:bg-white/10 h-2">
          <div className="h-2 rounded-full bg-brand-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm font-semibold text-brand-primary whitespace-nowrap">{pct}% Complete</p>
        {certInfo?.eligible && (
          <a
            href={`/api/learn/certificate/${course.id}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-900 hover:bg-yellow-300"
          >
            Download Certificate
          </a>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Lesson sidebar */}
        <aside className="w-72 flex-shrink-0 overflow-y-auto border-r dark:border-white/10 bg-slate-50 dark:bg-[#0f0f1a]">
          <div className="p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {progressData.completed_count}/{progressData.total} Lessons
            </p>
            {Object.entries(sections).map(([section, sLessons]) => (
              <div key={section} className="mb-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 px-1">{section}</p>
                {sLessons.map((l) => {
                  const isActive = activeLesson?.id === l.id;
                  const isLocked = !l.unlocked;
                  return (
                    <button
                      key={l.id}
                      disabled={isLocked}
                      onClick={() => !isLocked && setActiveLesson(l)}
                      className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-brand-primary text-white"
                          : isLocked
                          ? "cursor-not-allowed opacity-40"
                          : "hover:bg-slate-200 dark:hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-base leading-none">
                          {l.completed ? "✅" : isLocked ? "🔒" : "▶"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium leading-snug">{l.lesson_title}</p>
                          <p className="text-xs opacity-70">{l.duration_minutes} min</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Video area */}
          <div className="aspect-video w-full bg-black flex-shrink-0" style={{ maxHeight: "56vh" }}>
            <VideoPlayer url={activeLesson?.video_url} />
          </div>

          {/* Lesson info + tabs */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeLesson && (
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-slate-500">{activeLesson.section_title}</p>
                  <h2 className="font-heading text-xl font-bold">{activeLesson.lesson_title}</h2>
                  <p className="text-sm text-slate-500">{activeLesson.duration_minutes} minutes</p>
                </div>
                <button
                  onClick={handleCompleteLesson}
                  disabled={completing || activeLesson.completed || !activeLesson.unlocked}
                  className={`rounded-xl px-5 py-2 font-semibold text-sm transition ${
                    activeLesson.completed
                      ? "bg-emerald-100 text-emerald-700 cursor-default"
                      : "bg-brand-primary text-white hover:opacity-90 disabled:opacity-50"
                  }`}
                >
                  {completing ? "Saving..." : activeLesson.completed ? "✅ Completed" : "Mark as Complete"}
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="mt-4 flex gap-2 border-b dark:border-white/10">
              {["Notes", "Quiz"].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t.toLowerCase())}
                  className={`pb-2 text-sm font-medium border-b-2 px-1 transition ${
                    tab === t.toLowerCase() ? "border-brand-primary text-brand-primary" : "border-transparent text-slate-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "notes" && (
              <div className="mt-4 space-y-3">
                <textarea
                  className="w-full rounded-xl border p-3 text-sm bg-transparent dark:border-white/10"
                  rows={4}
                  placeholder="Take notes for this lesson..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
                <button onClick={saveNote} className="rounded-lg bg-brand-primary px-4 py-2 text-sm text-white">Save Note</button>
                <div className="space-y-2">
                  {(courseData.notes || []).map(n => (
                    <div key={n.id} className="rounded-lg border p-3 text-sm dark:border-white/10">
                      <p className="font-semibold text-xs text-slate-400 mb-1">{n.lesson_title}</p>
                      <p>{n.note_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "quiz" && (
              <div className="mt-4 space-y-4">
                {(courseData.quiz?.questions || []).length === 0 ? (
                  <p className="text-sm text-slate-500">No quiz for this course yet.</p>
                ) : (courseData.quiz?.questions || []).map(q => (
                  <div key={q.id} className="rounded-xl border p-4 dark:border-white/10">
                    <p className="font-medium text-sm">{q.question}</p>
                    <select
                      className="mt-2 w-full rounded-lg border p-2 text-sm bg-transparent"
                      value={quizAnswer[q.id] ?? ""}
                      onChange={e => setQuizAnswer({ ...quizAnswer, [q.id]: e.target.value })}
                    >
                      <option value="">Select answer</option>
                      {q.options.map((op, i) => <option key={op} value={i}>{op}</option>)}
                    </select>
                  </div>
                ))}
                {(courseData.quiz?.questions || []).length > 0 && (
                  <button onClick={submitQuizAnswers} className="rounded-lg bg-brand-primary px-4 py-2 text-sm text-white">
                    Submit Quiz
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
