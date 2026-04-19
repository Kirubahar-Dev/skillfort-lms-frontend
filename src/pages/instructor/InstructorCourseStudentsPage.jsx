import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseStudents } from "../../services/instructorService";

export default function InstructorCourseStudentsPage() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseStudents(courseId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [courseId]);

  const students = data?.items || [];

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/my-dashboard" className="text-sm text-brand-primary hover:underline">
          ← Dashboard
        </Link>
        <span className="text-slate-400">/</span>
        <h1 className="font-heading text-2xl font-bold">
          {data?.course_title || "Course"} — Students
        </h1>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{students.length} students enrolled</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center dark:border-white/10">
          <p className="font-semibold">No students enrolled yet</p>
          <p className="mt-1 text-sm text-slate-500">Students will appear here once they enroll in this course.</p>
        </div>
      ) : (
        <div className="rounded-2xl border dark:border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Student</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Progress</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/10">
              {students.map((s, i) => (
                <tr key={i} className="bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{s.student_name}</td>
                  <td className="px-4 py-3 text-slate-500">{s.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                          className="h-1.5 rounded-full bg-brand-primary"
                          style={{ width: `${s.progress_percent}%` }}
                        />
                      </div>
                      <span className="text-xs">{s.progress_percent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.completed ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {s.completed ? "Completed" : "In Progress"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {s.enrolled_at ? new Date(s.enrolled_at).toLocaleDateString("en-IN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
