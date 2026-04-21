import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addCourseNote, getLearnCourse } from "../../services/studentService";
import { completeLesson, getCertificateInfo, getLessonProgress } from "../../services/learnService";
import { getLessonQuizQuestions, submitLessonQuiz } from "../../services/quizService";

// ── YouTube IFrame API loader ─────────────────────────────────────────────────
let ytApiReady = false;
let ytApiCallbacks = [];
function loadYouTubeAPI() {
  if (ytApiReady) return Promise.resolve();
  return new Promise((resolve) => {
    ytApiCallbacks.push(resolve);
    if (!document.getElementById("yt-iframe-api")) {
      const s = document.createElement("script");
      s.id = "yt-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
      window.onYouTubeIframeAPIReady = () => {
        ytApiReady = true;
        ytApiCallbacks.forEach((cb) => cb());
        ytApiCallbacks = [];
      };
    }
  });
}

function extractYouTubeId(url) {
  const m =
    url.match(/[?&]v=([^&#]+)/) ||
    url.match(/youtu\.be\/([^?&#]+)/) ||
    url.match(/youtube\.com\/embed\/([^?&#]+)/);
  return m ? m[1] : null;
}

// ── Video Player (tracks progress for both HTML5 and YouTube) ─────────────────
function VideoPlayer({ url, onProgress, onEnded, watchedPct }) {
  const videoRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytContainerRef = useRef(null);
  const intervalRef = useRef(null);

  const isYoutube = url && (url.includes("youtube.com") || url.includes("youtu.be"));

  // ── HTML5 video tracking ──────────────────────────────────────────────────
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    onProgress(Math.round((v.currentTime / v.duration) * 100));
  };

  // ── YouTube player setup ──────────────────────────────────────────────────
  useEffect(() => {
    if (!url || !isYoutube || !ytContainerRef.current) return;

    const videoId = extractYouTubeId(url);
    if (!videoId) return;

    // Destroy previous player
    if (ytPlayerRef.current) {
      try { ytPlayerRef.current.destroy(); } catch (_) {}
      ytPlayerRef.current = null;
    }
    clearInterval(intervalRef.current);

    loadYouTubeAPI().then(() => {
      if (!ytContainerRef.current) return;
      // Create a fresh div for YT to attach to
      const div = document.createElement("div");
      div.id = `yt-player-${videoId}-${Date.now()}`;
      ytContainerRef.current.innerHTML = "";
      ytContainerRef.current.appendChild(div);

      ytPlayerRef.current = new window.YT.Player(div.id, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e) => {
            clearInterval(intervalRef.current);
            if (e.data === window.YT.PlayerState.PLAYING) {
              intervalRef.current = setInterval(() => {
                const p = ytPlayerRef.current;
                if (!p) return;
                const dur = p.getDuration?.() || 0;
                const cur = p.getCurrentTime?.() || 0;
                if (dur > 0) onProgress(Math.round((cur / dur) * 100));
              }, 3000);
            }
            if (e.data === window.YT.PlayerState.ENDED) {
              clearInterval(intervalRef.current);
              onProgress(100);
              onEnded();
            }
          },
        },
      });
    });

    return () => {
      clearInterval(intervalRef.current);
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch (_) {}
        ytPlayerRef.current = null;
      }
    };
  }, [url]);

  if (!url) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-900 rounded-xl gap-3">
        <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"/>
        </svg>
        <p className="text-slate-400 text-sm">No video for this lesson</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {isYoutube ? (
        <div ref={ytContainerRef} className="h-full w-full rounded-xl overflow-hidden" />
      ) : (
        <video
          ref={videoRef}
          key={url}
          src={url}
          controls
          className="h-full w-full rounded-xl bg-black"
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
        />
      )}
      {/* Watch progress overlay bar */}
      {watchedPct < 100 && (
        <div className="absolute bottom-0 left-0 right-0 rounded-b-xl overflow-hidden">
          <div className="relative h-1 bg-black/40">
            <div
              className="h-1 bg-brand-primary transition-all duration-500"
              style={{ width: `${watchedPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Quiz Modal ────────────────────────────────────────────────────────────────
function QuizModal({ lessonTitle, questions, onClose, onPass, lessonId }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id]);

  const handleSubmit = async () => {
    if (!allAnswered) { toast.error("Please answer all questions"); return; }
    setSubmitting(true);
    try {
      const res = await submitLessonQuiz(lessonId, answers);
      setResult(res);
      if (res.passed) {
        setTimeout(() => { onPass(res.progress_percent); }, 2500);
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const opts = ["A", "B", "C", "D"];
  const optKey = { A: "option_a", B: "option_b", C: "option_c", D: "option_d" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-[#141421]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 dark:border-white/10 dark:bg-[#141421]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lesson Quiz</p>
            <h2 className="font-heading text-lg font-bold">{lessonTitle}</h2>
          </div>
          {!result && (
            <button onClick={onClose} className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">
              ✕
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Result screen */}
          {result ? (
            <div className="text-center py-6">
              <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full text-5xl ${result.passed ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                {result.passed ? "🎉" : "😔"}
              </div>
              <h3 className={`text-2xl font-bold ${result.passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                {result.passed ? "Excellent! You Passed!" : "Not Quite There Yet"}
              </h3>
              <p className="mt-2 text-lg font-semibold">
                {result.score}/{result.total} correct — {result.percent}%
              </p>
              {result.passed
                ? <p className="mt-1 text-sm text-slate-500">Lesson marked complete! Moving to next lesson…</p>
                : <p className="mt-1 text-sm text-slate-500">You need 70% to pass. Rewatch the video and try again.</p>
              }

              {/* Per-question review */}
              <div className="mt-6 space-y-3 text-left">
                {result.results.map((r, i) => (
                  <div key={r.id} className={`rounded-xl border p-4 ${r.is_correct ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/30 dark:bg-emerald-900/10" : "border-red-200 bg-red-50 dark:border-red-800/30 dark:bg-red-900/10"}`}>
                    <p className="font-medium text-sm">{i + 1}. {r.question}</p>
                    <div className="mt-2 flex gap-3 text-xs">
                      <span className={`font-semibold ${r.is_correct ? "text-emerald-700 dark:text-emerald-400" : "text-red-600"}`}>
                        Your answer: {r.chosen || "—"}
                      </span>
                      {!r.is_correct && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          Correct: {r.correct_option}
                        </span>
                      )}
                    </div>
                    {r.explanation && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{r.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {!result.passed && (
                <button
                  onClick={() => { setResult(null); setAnswers({}); }}
                  className="mt-6 rounded-xl bg-brand-primary px-6 py-2.5 font-semibold text-slate-900 hover:opacity-90"
                >
                  Retry Quiz
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-slate-500">
                Answer all {questions.length} questions. You need <strong>70%</strong> to complete this lesson.
              </p>
              <div className="space-y-5">
                {questions.map((q, i) => (
                  <div key={q.id} className="rounded-xl border p-4 dark:border-white/10">
                    <p className="mb-3 font-semibold text-sm">
                      <span className="mr-2 rounded-full bg-brand-primary/20 px-2 py-0.5 text-xs font-bold text-brand-primary">Q{i + 1}</span>
                      {q.question}
                    </p>
                    <div className="space-y-2">
                      {opts.map((opt) => {
                        const val = q[optKey[opt]];
                        const selected = answers[q.id] === opt;
                        return (
                          <label key={opt} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${selected ? "border-brand-primary bg-brand-primary/10" : "border-slate-200 hover:border-brand-primary/50 dark:border-white/10"}`}>
                            <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${selected ? "border-brand-primary bg-brand-primary text-slate-900" : "border-slate-300 dark:border-white/20"}`}>
                              {opt}
                            </div>
                            <span className="text-sm">{val}</span>
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={opt}
                              checked={selected}
                              onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                              className="sr-only"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-400">{Object.keys(answers).length}/{questions.length} answered</p>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="rounded-xl bg-brand-primary px-8 py-2.5 font-bold text-slate-900 shadow transition hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="#1e293b" strokeWidth="4"/><path className="opacity-75" fill="#1e293b" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Submitting…</>
                  ) : "Submit Answers"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main LearnPage ────────────────────────────────────────────────────────────
export default function LearnPage() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [note, setNote] = useState("");
  const [certInfo, setCertInfo] = useState(null);
  const [tab, setTab] = useState("overview");

  // Video tracking
  const [watchedPct, setWatchedPct] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // Quiz
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Manual complete (no quiz)
  const [completing, setCompleting] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const cd = await getLearnCourse(courseSlug);
      setCourseData(cd);
      if (cd?.course?.id) {
        const pd = await getLessonProgress(cd.course.id);
        setProgressData(pd);
        if (!activeLesson) {
          const first = pd.lessons.find((l) => l.unlocked && !l.completed) || pd.lessons[0];
          if (first) setActiveLesson(first);
        }
        try {
          const ci = await getCertificateInfo(cd.course.id);
          setCertInfo(ci);
        } catch (_) {}
      }
    } catch {
      toast.error("Unable to load course");
    }
  }, [courseSlug]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // When lesson changes: reset video state + load quiz questions
  useEffect(() => {
    if (!activeLesson) return;
    setWatchedPct(0);
    setVideoEnded(false);
    setShowQuiz(false);

    // Load questions silently
    setQuizLoading(true);
    getLessonQuizQuestions(activeLesson.id)
      .then((qs) => setQuizQuestions(qs || []))
      .catch(() => setQuizQuestions([]))
      .finally(() => setQuizLoading(false));
  }, [activeLesson?.id]);

  const handleVideoProgress = (pct) => {
    setWatchedPct((prev) => Math.max(prev, pct));
  };

  const handleVideoEnded = () => {
    setWatchedPct(100);
    setVideoEnded(true);
  };

  // 80% watched threshold to unlock quiz/complete
  const videoUnlocked = !activeLesson?.video_url || watchedPct >= 80;

  const handleCompleteLesson = async () => {
    if (!activeLesson || activeLesson.completed || completing) return;
    setCompleting(true);
    try {
      const res = await completeLesson(activeLesson.id);
      toast.success(`✅ Lesson complete! ${res.progress_percent}%`);
      await refreshProgress(res.progress_percent);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed");
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizPass = async (progressPercent) => {
    setShowQuiz(false);
    toast.success(`🎉 Quiz passed! Progress: ${progressPercent}%`);
    await refreshProgress(progressPercent);
  };

  const refreshProgress = async (pct) => {
    const pd = await getLessonProgress(courseData.course.id);
    setProgressData(pd);
    const updated = pd.lessons.find((l) => l.id === activeLesson?.id);
    if (updated) setActiveLesson(updated);
    const nextIdx = pd.lessons.findIndex((l) => l.id === activeLesson?.id) + 1;
    if (nextIdx < pd.lessons.length && pd.lessons[nextIdx].unlocked) {
      setTimeout(() => setActiveLesson(pd.lessons[nextIdx]), 1200);
    }
    if (pct === 100) {
      try { const ci = await getCertificateInfo(courseData.course.id); setCertInfo(ci); } catch (_) {}
    }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    await addCourseNote(courseSlug, activeLesson?.lesson_title || "General", note);
    setNote(""); toast.success("Note saved"); loadAll();
  };

  if (!courseData || !progressData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Loading course…</p>
        </div>
      </div>
    );
  }

  const course = courseData.course;
  const lessons = progressData.lessons || [];
  const pct = progressData.progress_percent || 0;

  const sections = lessons.reduce((acc, l) => {
    if (!acc[l.section_title]) acc[l.section_title] = [];
    acc[l.section_title].push(l);
    return acc;
  }, {});

  const hasApprovedQuiz = quizQuestions.length > 0;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {/* Top progress bar */}
      <div className="flex items-center gap-4 border-b px-4 py-2 dark:border-white/10 bg-white dark:bg-[#0f0f1a]">
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
            🏆 Certificate
          </a>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Lesson sidebar */}
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
                        isActive ? "bg-brand-primary text-slate-900"
                        : isLocked ? "cursor-not-allowed opacity-40"
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
          {/* Video */}
          <div className="aspect-video w-full bg-black flex-shrink-0" style={{ maxHeight: "52vh" }}>
            <VideoPlayer
              url={activeLesson?.video_url}
              onProgress={handleVideoProgress}
              onEnded={handleVideoEnded}
              watchedPct={watchedPct}
            />
          </div>

          {/* Watch progress indicator */}
          {activeLesson?.video_url && !activeLesson.completed && (
            <div className="flex items-center gap-3 border-b px-4 py-2 dark:border-white/10 bg-slate-50 dark:bg-[#0f0f1a]">
              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${watchedPct >= 80 ? "bg-emerald-500" : "bg-brand-primary"}`}
                  style={{ width: `${watchedPct}%` }}
                />
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${watchedPct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
                {watchedPct >= 80
                  ? "✓ Video watched"
                  : `Watch ${80 - watchedPct}% more to unlock`}
              </span>
            </div>
          )}

          {/* Lesson info + action */}
          <div className="flex-1 overflow-y-auto">
            {activeLesson && (
              <div className="flex items-start justify-between gap-4 flex-wrap px-4 pt-4 pb-2">
                <div>
                  <p className="text-xs text-slate-500">{activeLesson.section_title}</p>
                  <h2 className="font-heading text-xl font-bold">{activeLesson.lesson_title}</h2>
                  <p className="text-sm text-slate-500">{activeLesson.duration_minutes} min</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {activeLesson.completed ? (
                    <span className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      ✅ Completed
                    </span>
                  ) : hasApprovedQuiz ? (
                    /* Quiz required */
                    <button
                      onClick={() => setShowQuiz(true)}
                      disabled={!videoUnlocked || quizLoading}
                      className="rounded-xl bg-brand-primary px-5 py-2 font-semibold text-sm text-slate-900 hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {videoUnlocked ? "Take Lesson Quiz" : `Watch ${80 - watchedPct}% more`}
                    </button>
                  ) : (
                    /* No quiz — mark complete */
                    <button
                      onClick={handleCompleteLesson}
                      disabled={completing || !videoUnlocked}
                      className="rounded-xl bg-brand-primary px-5 py-2 font-semibold text-sm text-slate-900 hover:opacity-90 disabled:opacity-50"
                    >
                      {completing ? "Saving…"
                        : videoUnlocked ? "✓ Mark as Complete"
                        : `Watch ${80 - watchedPct}% more`}
                    </button>
                  )}

                  {hasApprovedQuiz && !activeLesson.completed && (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      {quizQuestions.length}Q Quiz required
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b px-4 dark:border-white/10">
              {["Overview", "Notes"].map((t) => (
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

            {tab === "overview" && activeLesson && (
              <div className="p-4 space-y-4">
                <div className="rounded-xl border p-4 dark:border-white/10 space-y-2">
                  <h3 className="font-semibold text-sm">About this lesson</h3>
                  <p className="text-sm text-slate-500">{activeLesson.section_title} · {activeLesson.duration_minutes} min</p>
                  {hasApprovedQuiz && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 p-3">
                      <span className="text-xl">📝</span>
                      <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Quiz required to complete</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">{quizQuestions.length} questions · Need 70% to pass</p>
                      </div>
                    </div>
                  )}
                  {activeLesson.is_preview && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Free Preview</span>
                  )}
                </div>
              </div>
            )}

            {tab === "notes" && (
              <div className="p-4 space-y-3">
                <textarea
                  className="w-full rounded-xl border p-3 text-sm bg-transparent dark:border-white/10"
                  rows={4}
                  placeholder="Take notes for this lesson..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button onClick={saveNote} className="rounded-lg bg-brand-primary px-4 py-2 text-sm text-slate-900 font-semibold">
                  Save Note
                </button>
                <div className="space-y-2">
                  {(courseData.notes || []).map((n) => (
                    <div key={n.id} className="rounded-lg border p-3 text-sm dark:border-white/10">
                      <p className="font-semibold text-xs text-slate-400 mb-1">{n.lesson_title}</p>
                      <p>{n.note_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          lessonId={activeLesson.id}
          lessonTitle={activeLesson.lesson_title}
          questions={quizQuestions}
          onClose={() => setShowQuiz(false)}
          onPass={handleQuizPass}
        />
      )}
    </div>
  );
}
