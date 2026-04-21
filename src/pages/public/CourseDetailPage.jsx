import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchCourseBySlug } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

function inr(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="text-yellow-400">
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tab, setTab] = useState("overview");
  const [error, setError] = useState("");

  useEffect(() => {
    setCourse(null);
    setError("");
    fetchCourseBySlug(slug)
      .then(setCourse)
      .catch(() => setError("Unable to load this course. Please try again."));
  }, [slug]);

  const groupedSyllabus = useMemo(() => {
    const rows = course?.syllabus || [];
    const map = new Map();
    rows.forEach((l) => {
      if (!map.has(l.section_title)) map.set(l.section_title, []);
      map.get(l.section_title).push(l);
    });
    return Array.from(map.entries());
  }, [course]);

  function handleEnroll() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout", { state: { courseId: course.id, courseSlug: slug } });
  }

  if (error) return <div className="container-wide py-12 text-rose-600">{error}</div>;

  if (!course) {
    return (
      <div className="container-wide py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  const discount = course.price > course.discountPrice
    ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
    : 0;

  const highlights = [
    { icon: "🎓", label: "Certificate", value: "On Completion" },
    { icon: "📚", label: "Lessons", value: `${course.lessonsCount} lessons` },
    { icon: "❓", label: "Quizzes", value: `${course.quizzesCount} quizzes` },
    { icon: "⏱", label: "Duration", value: `${Math.round((course.durationMinutes || 0) / 60)} hrs` },
    { icon: "👥", label: "Students", value: `${(course.studentsCount || 0).toLocaleString("en-IN")} enrolled` },
    { icon: "🏆", label: "Rating", value: `${course.rating}/5.0` },
  ];

  return (
    <div>
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container-wide grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col justify-center">
            <span className="mb-3 inline-block w-fit rounded-full bg-brand-primary/20 px-3 py-1 text-xs font-semibold text-brand-primary ring-1 ring-brand-primary/30">
              {course.category}
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight md:text-4xl">{course.title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">{course.description?.slice(0, 220)}…</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span>
                <StarRating rating={course.rating} />{" "}
                <span className="text-white font-semibold">{course.rating}</span>
                <span className="ml-1 text-slate-400">({course.studentsCount?.toLocaleString("en-IN")} students)</span>
              </span>
              <span>Instructor: <span className="text-white font-medium">{course.instructor}</span></span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={course.thumbnail || "/images/student-learning.png"}
              alt={course.title}
              className="h-52 w-52 rounded-2xl object-contain drop-shadow-2xl"
              onError={(e) => { e.target.src = "/images/student-learning.png"; }}
            />
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <section>
            {/* Quick highlights */}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {highlights.map((h) => (
                <div key={h.label} className="rounded-xl border bg-slate-50 p-3 text-center dark:border-white/10 dark:bg-white/5">
                  <p className="text-xl">{h.icon}</p>
                  <p className="mt-1 text-xs font-semibold">{h.value}</p>
                  <p className="text-[10px] text-slate-500">{h.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["overview", "syllabus", "reviews"].map((t) => (
                <button
                  key={t}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                    tab === t ? "bg-brand-primary text-slate-900 border-brand-primary" : "hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                  onClick={() => setTab(t)}
                >
                  {t === "syllabus" ? "Course Syllabus" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="mt-5 rounded-2xl border p-6 dark:border-white/10">
                <h2 className="mb-3 font-heading text-xl font-semibold">About This Course</h2>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                  {course.description || "Course description will be updated soon."}
                </p>
                {course.category && (
                  <div className="mt-6 rounded-xl bg-brand-primary/5 p-4 ring-1 ring-brand-primary/20">
                    <p className="text-sm font-semibold text-brand-primary">Who is this course for?</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                      <li>• Freshers and working professionals targeting {course.category} roles</li>
                      <li>• Individuals seeking a career switch to software development</li>
                      <li>• Students preparing for campus placements</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {tab === "syllabus" && (
              <div className="mt-5 space-y-3">
                {groupedSyllabus.length === 0 ? (
                  <div className="rounded-2xl border p-8 text-center dark:border-white/10">
                    <p className="text-slate-500">Detailed syllabus coming soon.</p>
                  </div>
                ) : null}
                {groupedSyllabus.map(([section, lessons]) => (
                  <article key={section} className="rounded-2xl border p-4 dark:border-white/10">
                    <h2 className="font-semibold">{section}</h2>
                    <ul className="mt-2 space-y-2 text-sm">
                      {lessons.map((l) => (
                        <li key={l.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                          <span>{l.lesson_title}</span>
                          <span className="flex items-center gap-2 text-xs text-slate-500">
                            {l.is_preview ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">Preview</span> : null}
                            {l.duration_minutes} min
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div className="mt-5 rounded-2xl border p-6 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <p className="font-heading text-5xl font-bold text-brand-primary">{course.rating}</p>
                  <div>
                    <StarRating rating={course.rating} />
                    <p className="mt-1 text-sm text-slate-500">Course Rating</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Detailed student reviews are visible after enrollment. Enroll to see what other students say about this course.
                </p>
              </div>
            )}
          </section>

          {/* Sticky sidebar */}
          <aside className="sticky top-24 h-fit rounded-2xl border bg-white p-5 shadow-lg dark:border-white/10 dark:bg-[#141421]">
            <div className="flex items-center gap-3">
              <img
                src={course.thumbnail || "/images/student-learning.png"}
                alt={course.title}
                className="h-16 w-16 rounded-xl object-contain"
                onError={(e) => { e.target.src = "/images/student-learning.png"; }}
              />
              <div>
                <p className="text-2xl font-bold text-brand-primary">{inr(course.discountPrice)}</p>
                {discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400 line-through">{inr(course.price)}</span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">{discount}% off</span>
                  </div>
                )}
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex justify-between border-b pb-2 dark:border-white/10">
                <span>Duration</span>
                <span className="font-medium">{Math.round((course.durationMinutes || 0) / 60)} hours</span>
              </li>
              <li className="flex justify-between border-b pb-2 dark:border-white/10">
                <span>Lessons</span>
                <span className="font-medium">{course.lessonsCount}</span>
              </li>
              <li className="flex justify-between border-b pb-2 dark:border-white/10">
                <span>Quizzes</span>
                <span className="font-medium">{course.quizzesCount}</span>
              </li>
              <li className="flex justify-between border-b pb-2 dark:border-white/10">
                <span>Certificate</span>
                <span className="font-medium text-green-600">Yes ✓</span>
              </li>
              <li className="flex justify-between">
                <span>Instructor</span>
                <span className="font-medium">{course.instructor}</span>
              </li>
            </ul>

            <button
              onClick={handleEnroll}
              className="mt-5 w-full rounded-xl bg-brand-primary py-3 font-semibold text-slate-900 transition hover:opacity-90"
            >
              {isAuthenticated ? "Enroll Now" : "Login to Enroll"}
            </button>
            <button className="mt-3 w-full rounded-xl border py-3 text-sm font-semibold transition hover:bg-slate-50 dark:border-white/20 dark:hover:bg-white/10">
              Add to Wishlist
            </button>
            <Link to="/courses" className="mt-4 block text-center text-sm text-brand-primary hover:underline">
              ← Browse All Courses
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
