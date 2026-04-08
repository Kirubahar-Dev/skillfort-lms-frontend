import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { AnimatedPage } from "../../components/common/AnimatedPage";
import { PageHero } from "../../components/common/PageHero";
import { StatusBadge } from "../../components/common/StatusBadge";
import { MetricPanel } from "../../components/dashboard/MetricPanel";
import { SectionBlock } from "../../components/ui/SectionBlock";
import { useLmsStore } from "../../context/LmsStore";
import { studentNotifications } from "../../data/mockData";
import { formatDateTime, formatInr } from "../../lib/format";

const quizQuestions = [
  {
    id: "q1",
    question: "What is the main benefit of using REST conventions in API design?",
    options: ["Bigger payloads", "Predictable endpoints", "No authentication", "No documentation needed"],
    answer: 1,
  },
  {
    id: "q2",
    question: "Which option best describes idempotent HTTP methods?",
    options: ["Only POST", "Calls that always fail", "Repeated calls keep same outcome", "Only used for file uploads"],
    answer: 2,
  },
  {
    id: "q3",
    question: "What is the recommended way to secure user passwords?",
    options: ["Store plain text", "Client-side cache only", "One-way hash with salt", "Encode in Base64"],
    answer: 2,
  },
];

function useStudentCourseBuckets() {
  const { courseCatalog, enrolledCourseIds, wishlistIds } = useLmsStore();

  const enrolled = useMemo(
    () => courseCatalog.filter((course) => enrolledCourseIds.includes(course.id)),
    [courseCatalog, enrolledCourseIds],
  );

  const recommended = useMemo(
    () => courseCatalog.filter((course) => !enrolledCourseIds.includes(course.id)).slice(0, 4),
    [courseCatalog, enrolledCourseIds],
  );

  const wishlist = useMemo(
    () => courseCatalog.filter((course) => wishlistIds.includes(course.id)),
    [courseCatalog, wishlistIds],
  );

  return { enrolled, recommended, wishlist };
}

export function StudentDashboardPage() {
  const { enrolled } = useStudentCourseBuckets();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Student Dashboard"
        title="Track your learning progress"
        description="Overview of enrolled courses, progress state, quiz performance, and payment checkpoints."
        actions={
          <>
            <Link to="/student/my-courses" className="btn-primary">
              Continue Learning
            </Link>
            <Link to="/student/payments" className="btn-secondary">
              Payment History
            </Link>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricPanel label="Enrolled Courses" value={String(enrolled.length)} hint="Auto updated after successful payment" />
        <MetricPanel label="Completed Lessons" value="48" hint="Across all active tracks" />
        <MetricPanel label="Quiz Accuracy" value="82%" hint="Last 4 assessments" />
        <MetricPanel label="Certificates" value="2" hint="Download from certificates page" />
      </section>

      <SectionBlock title="Quick Access" description="Jump to high-frequency learner tasks.">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Enrolled courses", "/student/enrolled-courses"],
            ["My courses", "/student/my-courses"],
            ["Progress summary", "/student/progress"],
            ["Recommendations", "/student/recommendations"],
            ["Wishlist", "/student/wishlist"],
            ["Notifications", "/student/notifications"],
          ].map(([label, to]) => (
            <Link key={to} to={to} className="rounded-xl border bg-white px-4 py-3 font-medium text-sf-muted hover:bg-sf-cream">
              {label}
            </Link>
          ))}
        </div>
      </SectionBlock>
    </AnimatedPage>
  );
}

export function EnrolledCoursesPage() {
  const { enrolled } = useStudentCourseBuckets();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Enrolled Courses"
        title="Courses unlocked for your account"
        description="These are active tracks available in your learner player."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {enrolled.map((course) => (
          <article key={course.id} className="panel">
            <p className="kicker">{course.category}</p>
            <h2 className="mt-2 text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-sf-muted">{course.summary}</p>
            <div className="mt-4 flex gap-2">
              <Link className="btn-primary" to={`/student/course-player/${course.slug}`}>
                Open Player
              </Link>
              <Link className="btn-secondary" to={`/student/resources/${course.slug}`}>
                Resources
              </Link>
            </div>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function ProgressSummaryPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Progress"
        title="Learning progress summary"
        description="Track completion percentages, pending lessons, and upcoming milestones."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel">
          <h2 className="section-title">Course Completion</h2>
          <div className="mt-4 space-y-3">
            {[
              ["Python Full Stack", 72],
              ["Java Full Stack", 46],
              ["Data Analytics", 34],
            ].map(([name, value]) => (
              <div key={name as string}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-sf-muted">{name as string}</span>
                  <span className="font-semibold">{value as number}%</span>
                </div>
                <div className="h-2 rounded-full bg-sf-cream">
                  <div className="h-2 rounded-full bg-sf-gold" style={{ width: `${value as number}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2 className="section-title">Milestones</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-sf-muted">
            <li>Complete backend capstone by this weekend.</li>
            <li>Attempt module 3 quiz with 70% pass mark.</li>
            <li>Submit assignment draft before mentor review slot.</li>
            <li>Finish placement mock interview round-1.</li>
          </ul>
        </article>
      </section>
    </AnimatedPage>
  );
}

export function RecommendationsPage() {
  const { recommended } = useStudentCourseBuckets();
  const { addToCart } = useLmsStore();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Recommendations"
        title="Suggested next courses"
        description="Based on your learning profile and completed modules."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recommended.map((course) => (
          <article key={course.id} className="panel">
            <p className="kicker">{course.category}</p>
            <h2 className="mt-2 text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-sf-muted">{course.summary}</p>
            <p className="mt-3 text-base font-semibold">{formatInr(course.price)}</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-primary" onClick={() => addToCart(course)} type="button">
                Add to Cart
              </button>
              <Link className="btn-secondary" to={`/courses/${course.slug}`}>
                Details
              </Link>
            </div>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function MyCoursesPage() {
  const { enrolled } = useStudentCourseBuckets();

  return (
    <AnimatedPage>
      <PageHero
        kicker="My Courses"
        title="Resume your recorded learning"
        description="Continue where you left off and launch lesson player for each enrolled track."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {enrolled.map((course) => (
          <article key={course.id} className="panel">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <span className="rounded-full bg-sf-cream px-3 py-1 text-xs font-semibold">Recorded</span>
            </div>
            <p className="mt-2 text-sm text-sf-muted">{course.description}</p>
            <div className="mt-4 flex gap-2">
              <Link className="btn-primary" to={`/student/course-player/${course.slug}`}>
                Open Course Player
              </Link>
              <Link className="btn-secondary" to={`/student/quiz/${course.slug}`}>
                Take Quiz
              </Link>
            </div>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function WishlistPage() {
  const { wishlist } = useStudentCourseBuckets();
  const { addToCart, toggleWishlist } = useLmsStore();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Wishlist"
        title="Saved courses"
        description="Keep courses you want to purchase later and move them to cart anytime."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {wishlist.map((course) => (
          <article key={course.id} className="panel">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-sf-muted">{course.summary}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" className="btn-primary" onClick={() => addToCart(course)}>
                Add to Cart
              </button>
              <button type="button" className="btn-secondary" onClick={() => toggleWishlist(course.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function CertificatesPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Certificates"
        title="Your earned credentials"
        description="Download and share verified completion certificates."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["Java Full Stack Professional", "SF-CERT-2026-0142"],
          ["Placement Readiness Sprint", "SF-CERT-2026-0170"],
        ].map(([title, id]) => (
          <article key={id as string} className="panel">
            <h2 className="text-xl font-semibold">{title as string}</h2>
            <p className="mt-2 text-sm text-sf-muted">Certificate ID: {id as string}</p>
            <button type="button" className="btn-primary mt-4">
              Download Certificate
            </button>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function ProfileSettingsPage() {
  const [saved, setSaved] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <AnimatedPage>
      <PageHero kicker="Profile" title="Profile settings" description="Update your learner information and preferences." />

      <form className="panel grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        <label className="label-base">
          Full Name
          <input className="input-base mt-1" defaultValue="Kirubakar M" />
        </label>
        <label className="label-base">
          Email
          <input className="input-base mt-1" defaultValue="kirub@example.com" />
        </label>
        <label className="label-base">
          Mobile
          <input className="input-base mt-1" defaultValue="+91 93449 93939" />
        </label>
        <label className="label-base">
          Career Goal
          <input className="input-base mt-1" defaultValue="Full Stack Developer" />
        </label>
        <button className="btn-primary md:col-span-2" type="submit">
          Save Changes
        </button>
        {saved ? <p className="text-sm text-emerald-700 md:col-span-2">Profile saved successfully.</p> : null}
      </form>
    </AnimatedPage>
  );
}

export function StudentPaymentsPage() {
  const { orders } = useLmsStore();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Payment History"
        title="Transactions and invoices"
        description="View successful and failed payments, and open invoices for each order."
      />

      <section className="panel overflow-auto">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-sf-cream text-left">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-3 py-2 font-medium">{order.id}</td>
                <td className="px-3 py-2 text-sf-muted">{formatDateTime(order.createdAt)}</td>
                <td className="px-3 py-2">{formatInr(order.finalAmount)}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-3 py-2">
                  <Link to={`/invoice/${order.id}`} className="text-sf-goldStrong underline">
                    View Invoice
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AnimatedPage>
  );
}

export function CoursePlayerPage() {
  const { slug } = useParams();
  const { courseCatalog } = useLmsStore();
  const navigate = useNavigate();
  const course = courseCatalog.find((item) => item.slug === slug) ?? courseCatalog[0];
  const allLessons = course.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, module: module.title })));
  const [activeLessonId, setActiveLessonId] = useState(allLessons[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<"notes" | "resources" | "discussion">("notes");

  const activeIndex = allLessons.findIndex((lesson) => lesson.id === activeLessonId);
  const activeLesson = allLessons[activeIndex] ?? allLessons[0];

  const goToLesson = (direction: "next" | "prev") => {
    if (direction === "next" && activeIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[activeIndex + 1].id);
    }
    if (direction === "prev" && activeIndex > 0) {
      setActiveLessonId(allLessons[activeIndex - 1].id);
    }
  };

  return (
    <AnimatedPage>
      <PageHero
        kicker="Course Player"
        title={`${course.title} Learning Experience`}
        description="Video area, module sidebar, notes/resources tabs, and next/previous lesson controls."
      />

      <section className="grid gap-4 xl:grid-cols-[1fr_330px]">
        <article className="panel">
          <div className="relative overflow-hidden rounded-xl border bg-black/90 p-4 text-white">
            <img src={course.thumbnail} alt={course.title} className="h-56 w-full rounded-lg object-cover opacity-45 md:h-72" />
            <div className="absolute inset-x-8 bottom-8">
              <p className="text-xs uppercase tracking-[0.14em] text-white/70">{activeLesson?.kind} Lesson</p>
              <h2 className="mt-2 text-2xl font-semibold">{activeLesson?.title}</h2>
              <p className="mt-1 text-sm text-white/75">Module: {activeLesson?.module}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => goToLesson("prev")}>
              Previous Lesson
            </button>
            <button type="button" className="btn-primary" onClick={() => goToLesson("next")}>
              Next Lesson
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate(`/student/quiz/${course.slug}`)}>
              Take Quiz
            </button>
          </div>

          <div className="mt-4 rounded-xl border bg-white">
            <div className="flex border-b text-sm">
              {([
                ["notes", "Notes"],
                ["resources", "Resources"],
                ["discussion", "Discussion"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`px-4 py-3 ${activeTab === key ? "border-b-2 border-sf-goldStrong font-semibold" : "text-sf-muted"}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="p-4 text-sm text-sf-muted">
              {activeTab === "notes"
                ? "Lesson notes panel with editable annotations and timestamp references."
                : activeTab === "resources"
                ? "Downloadable files: slides, code snippets, assignments, and worksheet PDFs."
                : "Discussion feed for learner doubts and mentor clarifications."}
            </div>
          </div>
        </article>

        <aside className="panel">
          <h2 className="section-title">Modules & Lessons</h2>
          <div className="mt-3 space-y-3">
            {course.modules.map((module) => (
              <article key={module.id} className="rounded-xl border bg-white p-3">
                <p className="text-sm font-semibold">{module.title}</p>
                <div className="mt-2 space-y-1">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`block w-full rounded-lg px-2 py-1.5 text-left text-xs ${activeLessonId === lesson.id ? "bg-sf-cream text-sf-ink" : "text-sf-muted hover:bg-slate-50"}`}
                    >
                      {lesson.title} ({lesson.duration})
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </AnimatedPage>
  );
}

export function LessonDetailPage() {
  const { slug, lessonId } = useParams();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Lesson Detail"
        title={`Lesson view for ${slug}`}
        description={`Dedicated lesson route for deep-link support. Current lesson id: ${lessonId ?? "N/A"}`}
      />
      <section className="panel text-sm text-sf-muted">
        This route can host transcript view, AI summary, and section-wise discussion threads.
      </section>
    </AnimatedPage>
  );
}

export function DownloadResourcesPage() {
  const { slug } = useParams();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Resources"
        title="Download learning resources"
        description={`Download PDF notes, starter code, and assignment templates for ${slug}.`}
      />
      <section className="panel space-y-2 text-sm">
        {[
          "Module-wise PDF notes",
          "Starter project zip",
          "Assignment template",
          "Interview question workbook",
        ].map((item) => (
          <article key={item} className="flex items-center justify-between rounded-xl border bg-white px-3 py-3">
            <span>{item}</span>
            <button className="btn-secondary" type="button">
              Download
            </button>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function QuizPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(9 * 60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const submitQuiz = () => {
    const score = quizQuestions.reduce((sum, item) => (answers[item.id] === item.answer ? sum + 1 : sum), 0);
    navigate(`/student/quiz-result/${slug}?score=${score}&total=${quizQuestions.length}`);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <AnimatedPage>
      <PageHero
        kicker="Assessment"
        title="Quiz page"
        description="MCQ + timer flow for learner assessments."
        actions={
          <button type="button" className="btn-primary" onClick={submitQuiz}>
            Submit Quiz
          </button>
        }
      />

      <section className="panel">
        <p className="text-sm text-sf-muted">Time Left</p>
        <p className="mt-1 font-display text-3xl">{mm}:{ss}</p>
      </section>

      <section className="grid gap-4">
        {quizQuestions.map((item, index) => (
          <article key={item.id} className="panel">
            <h2 className="text-lg font-semibold">
              Q{index + 1}. {item.question}
            </h2>
            <div className="mt-3 grid gap-2">
              {item.options.map((option, optionIndex) => (
                <label key={option} className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm">
                  <input
                    type="radio"
                    name={item.id}
                    checked={answers[item.id] === optionIndex}
                    onChange={() => setAnswers((state) => ({ ...state, [item.id]: optionIndex }))}
                  />
                  {option}
                </label>
              ))}
            </div>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function QuizResultPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();

  const score = Number(params.get("score") ?? 0);
  const total = Number(params.get("total") ?? quizQuestions.length);

  return (
    <AnimatedPage>
      <PageHero
        kicker="Quiz Result"
        title="Assessment summary"
        description={`Course: ${slug} | Score ${score}/${total}`}
        actions={
          <>
            <Link to="/student/my-courses" className="btn-primary">
              Back to My Courses
            </Link>
            <Link to={`/student/assignment/${slug}`} className="btn-secondary">
              Submit Assignment
            </Link>
          </>
        }
      />

      <section className="panel text-sm text-sf-muted">
        {score / Math.max(total, 1) >= 0.7
          ? "Great work. You cleared the passing threshold."
          : "Retake recommended. Review lessons and attempt again."}
      </section>
    </AnimatedPage>
  );
}

export function AssignmentSubmissionPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => {
      navigate(`/student/assignment-result/${slug}`);
    }, 900);
  };

  return (
    <AnimatedPage>
      <PageHero
        kicker="Assignment"
        title="Assignment submission"
        description="Upload project links and explanation for mentor evaluation."
      />

      <form className="panel space-y-3" onSubmit={onSubmit}>
        <label className="label-base">
          GitHub Repository
          <input className="input-base mt-1" placeholder="https://github.com/..." required />
        </label>
        <label className="label-base">
          Live Demo URL
          <input className="input-base mt-1" placeholder="https://..." />
        </label>
        <label className="label-base">
          Notes
          <textarea className="input-base mt-1 min-h-24" placeholder="Explain your approach" />
        </label>
        <button type="submit" className="btn-primary">
          Submit Assignment
        </button>
        {submitted ? <p className="text-sm text-emerald-700">Submitted. Redirecting to feedback page...</p> : null}
      </form>
    </AnimatedPage>
  );
}

export function AssignmentResultPage() {
  const { slug } = useParams();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Assignment Feedback"
        title="Mentor evaluation"
        description={`Feedback summary for ${slug}.`}
      />

      <section className="panel space-y-2 text-sm text-sf-muted">
        <p>Score: 8.5 / 10</p>
        <p>Strengths: architecture clarity, clean API handling, readable code flow.</p>
        <p>Improvements: improve edge-case handling and test coverage for validation flow.</p>
      </section>
    </AnimatedPage>
  );
}

export function NotificationsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Notifications"
        title="Alerts and updates"
        description="System notifications for assignments, coupons, schedules, and certificates."
      />

      <section className="panel space-y-2">
        {studentNotifications.map((note) => (
          <article key={note} className="rounded-xl border bg-white px-3 py-3 text-sm text-sf-muted">
            {note}
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}