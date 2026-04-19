import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createCourse,
  createCourseLesson,
  deleteCourse,
  deleteCourseLesson,
  fetchCourseLessons,
  updateCourse,
  updateCourseLesson,
} from "../../services/courseService";
import { fetchAdminCourseInsights } from "../../services/adminService";

export default function AdminCoursesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lessonSaving, setLessonSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({
    id: null,
    section_title: "",
    lesson_title: "",
    duration_minutes: 15,
    video_url: "",
    order_index: 1,
    is_preview: false,
  });
  const [form, setForm] = useState({
    slug: "",
    title: "",
    thumbnail: "",
    description: "",
    price: 0,
    discountPrice: 0,
    category: "Full Stack Training",
    instructor: "",
    lessonsCount: 0,
    quizzesCount: 0,
    durationMinutes: 0,
    studentsCount: 0,
    rating: 4.5,
    status: "published",
  });

  const resetForm = () => {
    setEditing(null);
    setForm({
      slug: "",
      title: "",
      thumbnail: "",
      description: "",
      price: 0,
      discountPrice: 0,
      category: "Full Stack Training",
      instructor: "",
      lessonsCount: 0,
      quizzesCount: 0,
      durationMinutes: 0,
      studentsCount: 0,
      rating: 4.5,
      status: "published",
    });
  };

  useEffect(() => {
    reloadCourses();
  }, []);

  const reloadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCourseInsights();
      setItems(data.items || []);
    } catch {
      setItems([]);
      toast.error("Unable to load courses");
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (courseId) => {
    setActiveCourseId(courseId);
    try {
      const data = await fetchCourseLessons(courseId);
      setLessons(data || []);
      setLessonForm({ id: null, section_title: "", lesson_title: "", duration_minutes: 15, video_url: "", order_index: 1, is_preview: false });
    } catch {
      setLessons([]);
      toast.error("Unable to load lessons");
    }
  };

  const onEdit = (course) => {
    setEditing(course.id);
    setForm({
      slug: course.slug,
      title: course.title,
      thumbnail: course.thumbnail || "",
      description: course.description || "",
      price: course.price,
      discountPrice: course.discountPrice,
      category: course.category,
      instructor: course.instructor,
      lessonsCount: course.lessonsCount,
      quizzesCount: course.quizzesCount,
      durationMinutes: course.durationMinutes,
      studentsCount: course.studentsCount,
      rating: course.rating,
      status: course.status,
    });
  };

  const onSubmitCourse = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateCourse(editing, form);
        toast.success("Course updated");
      } else {
        await createCourse(form);
        toast.success("Course created");
      }
      await reloadCourses();
      resetForm();
    } catch {
      toast.error("Unable to save course");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted");
      if (activeCourseId === id) {
        setActiveCourseId(null);
        setLessons([]);
      }
      reloadCourses();
    } catch {
      toast.error("Unable to delete course");
    }
  };

  const onSubmitLesson = async (e) => {
    e.preventDefault();
    if (!activeCourseId) return;
    setLessonSaving(true);
    try {
      const payload = { ...lessonForm, duration_minutes: Number(lessonForm.duration_minutes), order_index: Number(lessonForm.order_index) };
      if (lessonForm.id) {
        await updateCourseLesson(lessonForm.id, payload);
        toast.success("Lesson updated");
      } else {
        await createCourseLesson(activeCourseId, payload);
        toast.success("Lesson added");
      }
      await loadLessons(activeCourseId);
      await reloadCourses();
    } catch {
      toast.error("Unable to save lesson");
    } finally {
      setLessonSaving(false);
    }
  };

  const onDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await deleteCourseLesson(lessonId);
      toast.success("Lesson deleted");
      if (activeCourseId) {
        await loadLessons(activeCourseId);
        await reloadCourses();
      }
    } catch {
      toast.error("Unable to delete lesson");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Courses</h1>
      <p className="mt-2 text-sm text-slate-500">Total courses: {items.length}</p>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmitCourse} className="rounded-2xl border p-4 dark:border-white/10">
          <h2 className="font-semibold">{editing ? "Edit Course" : "Create Course"}</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block">Course Slug</span>
              <input className="w-full rounded-lg border p-2 bg-transparent" placeholder="course-slug" required value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} disabled={Boolean(editing)} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block">Course Title</span>
              <input className="w-full rounded-lg border p-2 bg-transparent" placeholder="Title" required value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="mb-1 block">Thumbnail URL</span>
              <input className="w-full rounded-lg border p-2 bg-transparent" placeholder="https://..." value={form.thumbnail} onChange={(e) => setForm((s) => ({ ...s, thumbnail: e.target.value }))} />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="mb-1 block">Description</span>
              <textarea className="w-full rounded-lg border p-2 bg-transparent" placeholder="Course details..." rows="3" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
            </label>
            <label className="text-sm"><span className="mb-1 block">Price (INR)</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value || 0) }))} /></label>
            <label className="text-sm"><span className="mb-1 block">Discount Price (INR)</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={form.discountPrice} onChange={(e) => setForm((s) => ({ ...s, discountPrice: Number(e.target.value || 0) }))} /></label>
            <label className="text-sm"><span className="mb-1 block">Category</span><input className="w-full rounded-lg border p-2 bg-transparent" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} /></label>
            <label className="text-sm"><span className="mb-1 block">Instructor</span><input className="w-full rounded-lg border p-2 bg-transparent" value={form.instructor} onChange={(e) => setForm((s) => ({ ...s, instructor: e.target.value }))} /></label>
            <label className="text-sm"><span className="mb-1 block">Lessons</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={form.lessonsCount} onChange={(e) => setForm((s) => ({ ...s, lessonsCount: Number(e.target.value || 0) }))} /></label>
            <label className="text-sm"><span className="mb-1 block">Quizzes</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={form.quizzesCount} onChange={(e) => setForm((s) => ({ ...s, quizzesCount: Number(e.target.value || 0) }))} /></label>
            <label className="text-sm"><span className="mb-1 block">Duration (minutes)</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={form.durationMinutes} onChange={(e) => setForm((s) => ({ ...s, durationMinutes: Number(e.target.value || 0) }))} /></label>
            <label className="text-sm"><span className="mb-1 block">Student Count</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={form.studentsCount} onChange={(e) => setForm((s) => ({ ...s, studentsCount: Number(e.target.value || 0) }))} /></label>
            <label className="text-sm"><span className="mb-1 block">Rating</span><input type="number" step="0.1" className="w-full rounded-lg border p-2 bg-transparent" value={form.rating} onChange={(e) => setForm((s) => ({ ...s, rating: Number(e.target.value || 0) }))} /></label>
            <label className="text-sm">
              <span className="mb-1 block">Status</span>
              <select className="w-full rounded-lg border p-2 bg-transparent" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button disabled={saving} className="rounded-lg bg-brand-primary px-4 py-2 text-white">{saving ? "Saving..." : editing ? "Update Course" : "Create Course"}</button>
            <button type="button" className="rounded-lg border px-4 py-2" onClick={resetForm}>Reset</button>
          </div>
        </form>

        <section className="rounded-2xl border p-4 dark:border-white/10">
          <h2 className="font-semibold">Curriculum Builder</h2>
          {!activeCourseId ? <p className="mt-2 text-sm text-slate-500">Select a course from the table to manage lessons.</p> : null}
          {activeCourseId ? (
            <>
              <form onSubmit={onSubmitLesson} className="mt-3 grid gap-2">
                <input className="rounded-lg border p-2 bg-transparent" placeholder="Section title" required value={lessonForm.section_title} onChange={(e) => setLessonForm((s) => ({ ...s, section_title: e.target.value }))} />
                <input className="rounded-lg border p-2 bg-transparent" placeholder="Lesson title" required value={lessonForm.lesson_title} onChange={(e) => setLessonForm((s) => ({ ...s, lesson_title: e.target.value }))} />
                <input type="number" className="rounded-lg border p-2 bg-transparent" placeholder="Duration minutes" value={lessonForm.duration_minutes} onChange={(e) => setLessonForm((s) => ({ ...s, duration_minutes: Number(e.target.value || 0) }))} />
                <input className="rounded-lg border p-2 bg-transparent" placeholder="Video URL" value={lessonForm.video_url} onChange={(e) => setLessonForm((s) => ({ ...s, video_url: e.target.value }))} />
                <input type="number" className="rounded-lg border p-2 bg-transparent" placeholder="Order index" value={lessonForm.order_index} onChange={(e) => setLessonForm((s) => ({ ...s, order_index: Number(e.target.value || 1) }))} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={lessonForm.is_preview} onChange={(e) => setLessonForm((s) => ({ ...s, is_preview: e.target.checked }))} /> Preview lesson</label>
                <div className="flex gap-2">
                  <button disabled={lessonSaving} className="rounded-lg bg-brand-primary px-3 py-2 text-sm text-white">{lessonSaving ? "Saving..." : lessonForm.id ? "Update Lesson" : "Add Lesson"}</button>
                  <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => setLessonForm({ id: null, section_title: "", lesson_title: "", duration_minutes: 15, video_url: "", order_index: 1, is_preview: false })}>Reset</button>
                </div>
              </form>
              <div className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-lg border p-2 dark:border-white/10">
                    <p className="font-semibold">{lesson.lesson_title}</p>
                    <p className="text-xs text-slate-500">{lesson.section_title} | {lesson.duration_minutes}m | #{lesson.order_index}</p>
                    <div className="mt-1 space-x-2">
                      <button className="rounded border px-2 py-1 text-xs" onClick={() => setLessonForm(lesson)}>Edit</button>
                      <button className="rounded border px-2 py-1 text-xs text-rose-500" onClick={() => onDeleteLesson(lesson.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </section>
      </div>

      <div className="mt-6 overflow-auto rounded-2xl border dark:border-white/10">
        {loading ? (
          <div className="p-4 text-sm">Loading courses...</div>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b dark:border-white/10">
                <th className="p-3">Title</th>
                <th>Category</th>
                <th>Instructor</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Lessons</th>
                <th>Enrolled</th>
                <th>Live</th>
                <th>Income</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b dark:border-white/10">
                  <td className="p-3">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-slate-500">/{c.slug}</p>
                  </td>
                  <td>{c.category}</td>
                  <td>{c.instructor}</td>
                  <td>₹{c.price.toLocaleString()}</td>
                  <td>₹{c.discountPrice.toLocaleString()}</td>
                  <td>{c.lessonsCount}</td>
                  <td>{c.enrolledCount || 0}</td>
                  <td>{c.liveStudents || 0}</td>
                  <td>₹{Number((c.income || 0) / 100).toLocaleString()}</td>
                  <td>{c.rating}</td>
                  <td>
                    <span className={`rounded-full px-2 py-1 text-xs ${c.status === "published" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => onEdit(c)}>Edit</button>
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => loadLessons(c.id)}>Lessons</button>
                    <button className="rounded border px-2 py-1 text-xs text-rose-500" onClick={() => onDeleteCourse(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
