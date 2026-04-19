import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createStudentReview, deleteStudentReview, getMyCourses, getStudentReviews, updateStudentReview } from "../../services/studentService";

export default function MyReviewsPage() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ course_id: "", rating: 5, comment: "" });

  const load = () => getStudentReviews().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  useEffect(() => {
    load();
    getMyCourses().then((d) => setCourses(d.items || [])).catch(() => setCourses([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.course_id) return;
    await createStudentReview(Number(form.course_id), Number(form.rating), form.comment);
    toast.success("Review submitted");
    setForm({ course_id: "", rating: 5, comment: "" });
    load();
  };

  return (
    <div>
      <h1 className="font-heading text-4xl">My Reviews</h1>
      <form onSubmit={submit} className="mt-4 grid gap-2 rounded-xl border p-3 dark:border-white/10 md:grid-cols-4">
        <select className="rounded border p-2 bg-transparent" value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
          <option value="">Select Course</option>
          {courses.map((c) => <option key={c.course_id} value={c.course_id}>{c.title}</option>)}
        </select>
        <input type="number" min="1" max="5" className="rounded border p-2 bg-transparent" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
        <input className="rounded border p-2 bg-transparent" placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        <button className="rounded bg-brand-primary px-3 py-2 text-white">Add Review</button>
      </form>

      <div className="mt-4 space-y-2">
        {items.map((r) => (
          <div key={r.id} className="rounded-xl border p-3 dark:border-white/10">
            <p className="font-semibold">{r.course} • {r.rating}/5 • {r.status}</p>
            <p className="text-sm text-slate-500">{r.comment}</p>
            <div className="mt-2 space-x-2">
              <button className="rounded border px-2 py-1 text-xs" onClick={async () => { await updateStudentReview(r.id, r.rating, r.comment + " (updated)"); load(); }}>Update</button>
              <button className="rounded border px-2 py-1 text-xs text-rose-500" onClick={async () => { await deleteStudentReview(r.id); load(); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
