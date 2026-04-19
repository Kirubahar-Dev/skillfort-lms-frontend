import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/ui/StatCard";
import { getStudentDashboard } from "../../services/studentService";

export default function StudentDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getStudentDashboard().then(setData).catch(() => setData(null));
  }, []);

  const stats = data?.stats || {};

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">My Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Enrolled Courses" value={stats.total_enrolled_courses ?? 0} />
        <StatCard label="Completed Courses" value={stats.completed_courses ?? 0} />
        <StatCard label="In Progress Courses" value={stats.in_progress_courses ?? 0} />
        <StatCard label="Certificates Earned" value={stats.certificates_earned ?? 0} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border p-5 dark:border-white/10">
          <h2 className="font-semibold">Recent Activity</h2>
          <div className="mt-3 space-y-2 text-sm">
            {(data?.recent_activity || []).map((x, i) => (
              <div key={i} className="rounded-lg border p-3 dark:border-white/10">
                Last lesson: {x.last_lesson || "N/A"} • Progress: {x.progress_percent}%
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border p-5 dark:border-white/10">
          <h2 className="font-semibold">Interview Prep Progress</h2>
          <p className="mt-2 text-sm">Bookmarked Questions: {data?.interview_prep_progress?.bookmarked_questions ?? 0}</p>
          <p className="text-sm">Planner Completion: {data?.interview_prep_progress?.planner_completion_percent ?? 0}%</p>
          <Link to="/my-interview-prep" className="mt-3 inline-block text-sm text-brand-primary">Go to Interview Prep</Link>
        </div>
      </div>
    </div>
  );
}
