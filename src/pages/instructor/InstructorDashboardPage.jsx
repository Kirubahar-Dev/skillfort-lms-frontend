import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/ui/StatCard";
import { getInstructorDashboard } from "../../services/instructorService";
import { useAuth } from "../../context/AuthContext";

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInstructorDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};
  const courses = data?.courses || [];

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-lg font-bold text-slate-900">
          {user?.full_name?.charAt(0) || "I"}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.full_name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="My Courses" value={stats.total_courses ?? 0} />
        <StatCard label="Total Students" value={stats.total_students ?? 0} />
        <StatCard label="Total Revenue" value={`₹${((stats.total_revenue ?? 0) / 100).toLocaleString("en-IN")}`} />
        <StatCard label="Avg Rating" value={`${stats.avg_rating ?? 0} ★`} />
        <StatCard label="Pending Reviews" value={stats.pending_reviews ?? 0} />
      </div>

      {/* My Courses */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">My Courses</h2>
        </div>

        {loading ? (
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="mt-6 rounded-2xl border p-8 text-center dark:border-white/10">
            <img src="/images/student-learning.png" alt="" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover opacity-50" />
            <p className="font-semibold">No courses assigned yet</p>
            <p className="mt-1 text-sm text-slate-500">Contact your admin to assign courses to your instructor account.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {courses.map((c) => (
              <div key={c.id} className="rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex gap-4">
                  <img
                    src={c.thumbnail || "/images/student-learning.png"}
                    alt={c.title}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                    onError={(e) => { e.target.src = "/images/student-learning.png"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold leading-tight truncate">{c.title}</p>
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{c.category}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                    <p className="font-bold text-brand-primary">{c.students_enrolled}</p>
                    <p className="text-slate-500">Students</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                    <p className="font-bold text-brand-primary">{c.avg_progress_percent}%</p>
                    <p className="text-slate-500">Avg Progress</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                    <p className="font-bold text-brand-primary">{c.rating} ★</p>
                    <p className="text-slate-500">Rating</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/instructor/courses/${c.id}/students`}
                    className="flex-1 rounded-lg bg-brand-primary py-1.5 text-center text-xs font-semibold text-slate-900"
                  >
                    View Students
                  </Link>
                  <Link
                    to={`/course/${c.slug}`}
                    className="flex-1 rounded-lg border py-1.5 text-center text-xs font-semibold dark:border-white/20"
                  >
                    Course Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 rounded-2xl border bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
        <h3 className="font-semibold">Instructor Tips</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• Keep track of your students' progress and reach out to those falling behind</li>
          <li>• Respond to pending reviews to improve your course rating</li>
          <li>• Contact admin to add new lessons or update course content</li>
          <li>• Use the student roster to prepare targeted interview prep sessions</li>
        </ul>
      </div>
    </div>
  );
}
