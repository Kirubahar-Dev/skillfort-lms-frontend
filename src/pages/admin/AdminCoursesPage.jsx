import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCourse, createCourseLesson, deleteCourse, deleteCourseLesson, fetchCourseLessons, updateCourse, updateCourseLesson } from "../../services/courseService";
import { fetchAdminCourseInsights } from "../../services/adminService";
import { getAdminCourseProgress, updateLessonVideo } from "../../services/learnService";

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#141421] ${wide ? "max-w-4xl" : "max-w-2xl"}`} onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const EMPTY_COURSE = { slug:"",title:"",thumbnail:"",description:"",price:0,discountPrice:0,category:"Full Stack Training",instructor:"",lessonsCount:0,quizzesCount:0,durationMinutes:0,studentsCount:0,rating:4.5,status:"published" };
const EMPTY_LESSON = { id:null,section_title:"",lesson_title:"",duration_minutes:15,video_url:"",order_index:1,is_preview:false };
const CATEGORIES = ["Full Stack Training","Python","Java","Oracle","AWS","Data Analyst","React","DevOps","Other"];

export default function AdminCoursesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseModal, setCourseModal] = useState(null);
  const [syllabusModal, setSyllabusModal] = useState(null);
  const [progressModal, setProgressModal] = useState(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  const [saving, setSaving] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON);
  const [lessonSaving, setLessonSaving] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [progressData, setProgressData] = useState(null);

  const reloadCourses = async () => {
    setLoading(true);
    try { const data = await fetchAdminCourseInsights(); setItems(data.courses || data || []); }
    catch { setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { reloadCourses(); }, []);

  const openCreate = () => { setCourseForm(EMPTY_COURSE); setCourseModal("create"); };
  const openEdit = (c) => {
    setCourseForm({ slug:c.slug,title:c.title,thumbnail:c.thumbnail||"",description:c.description||"",price:c.price,discountPrice:c.discountPrice,category:c.category,instructor:c.instructor,lessonsCount:c.lessonsCount,quizzesCount:c.quizzesCount,durationMinutes:c.durationMinutes,studentsCount:c.studentsCount,rating:c.rating,status:c.status,_id:c.id });
    setCourseModal("edit");
  };
  const onSubmitCourse = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (courseModal === "edit") { await updateCourse(courseForm._id, courseForm); toast.success("Course updated"); }
      else { await createCourse(courseForm); toast.success("Course created"); }
      setCourseModal(null); await reloadCourses();
    } catch { toast.error("Unable to save course"); } finally { setSaving(false); }
  };
  const onDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try { await deleteCourse(id); toast.success("Deleted"); await reloadCourses(); }
    catch { toast.error("Unable to delete"); }
  };
  const openSyllabus = async (course) => {
    setSyllabusModal(course);
    const data = await fetchCourseLessons(course.id);
    setLessons(data || []); setLessonForm(EMPTY_LESSON);
  };
  const onSubmitLesson = async (e) => {
    e.preventDefault(); if (!syllabusModal) return; setLessonSaving(true);
    try {
      const payload = { ...lessonForm, duration_minutes: Number(lessonForm.duration_minutes), order_index: Number(lessonForm.order_index) };
      if (lessonForm.id) { await updateCourseLesson(lessonForm.id, payload); toast.success("Lesson updated"); }
      else { await createCourseLesson(syllabusModal.id, payload); toast.success("Lesson added"); }
      const data = await fetchCourseLessons(syllabusModal.id);
      setLessons(data || []); setLessonForm(EMPTY_LESSON); await reloadCourses();
    } catch { toast.error("Unable to save lesson"); } finally { setLessonSaving(false); }
  };
  const onDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete lesson?")) return;
    try {
      await deleteCourseLesson(lessonId); toast.success("Deleted");
      const data = await fetchCourseLessons(syllabusModal.id); setLessons(data || []); await reloadCourses();
    } catch { toast.error("Unable to delete"); }
  };
  const onSaveVideoUrl = async (lessonId) => {
    try {
      await updateLessonVideo(lessonId, videoUrl); toast.success("Video saved");
      const data = await fetchCourseLessons(syllabusModal.id);
      setLessons(data || []); setEditingVideoId(null); setVideoUrl("");
    } catch { toast.error("Unable to save video"); }
  };
  const openProgress = async (course) => {
    setProgressModal(course); setProgressData(null);
    try { const d = await getAdminCourseProgress(course.id); setProgressData(d); }
    catch { toast.error("Unable to load progress"); }
  };

  const cf = (key) => (e) => setCourseForm(s => ({ ...s, [key]: e.target.value }));
  const cfN = (key) => (e) => setCourseForm(s => ({ ...s, [key]: Number(e.target.value || 0) }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold">Courses</h1>
          <p className="mt-1 text-sm text-slate-500">{items.length} total courses</p>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-brand-primary px-4 py-2 font-semibold text-white hover:opacity-90">+ New Course</button>
      </div>

      <div className="mt-5 overflow-auto rounded-2xl border dark:border-white/10">
        {loading ? <div className="p-6 text-sm text-slate-500">Loading...</div> : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 dark:border-white/10 dark:bg-white/5">
                {["Title","Category","Instructor","Price","Enrolled","Rating","Status","Actions"].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/10">
              {items.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="p-3"><p className="font-medium">{c.title}</p><p className="text-xs text-slate-400">/{c.slug}</p></td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3">{c.instructor}</td>
                  <td className="p-3"><p>&#8377;{Number(c.discountPrice).toLocaleString("en-IN")}</p><p className="text-xs text-slate-400 line-through">&#8377;{Number(c.price).toLocaleString("en-IN")}</p></td>
                  <td className="p-3">{c.enrolledCount || 0}</td>
                  <td className="p-3">{c.rating}</td>
                  <td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${c.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{c.status}</span></td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => openEdit(c)} className="rounded border px-2 py-1 text-xs hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">Edit</button>
                      <button onClick={() => openSyllabus(c)} className="rounded border px-2 py-1 text-xs hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">Syllabus</button>
                      <button onClick={() => openProgress(c)} className="rounded border px-2 py-1 text-xs hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">Progress</button>
                      <button onClick={() => onDeleteCourse(c.id)} className="rounded border px-2 py-1 text-xs text-rose-500 hover:bg-rose-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {courseModal && (
        <Modal title={courseModal === "edit" ? "Edit Course" : "Create New Course"} onClose={() => setCourseModal(null)}>
          <form onSubmit={onSubmitCourse} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm"><span className="mb-1 block font-medium">Slug</span><input className="w-full rounded-lg border p-2 bg-transparent" required placeholder="python-bootcamp" value={courseForm.slug} onChange={cf("slug")} disabled={courseModal === "edit"} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Title</span><input className="w-full rounded-lg border p-2 bg-transparent" required value={courseForm.title} onChange={cf("title")} /></label>
              <label className="text-sm md:col-span-2"><span className="mb-1 block font-medium">Thumbnail URL</span><input className="w-full rounded-lg border p-2 bg-transparent" placeholder="/images/python-logo.png" value={courseForm.thumbnail} onChange={cf("thumbnail")} /></label>
              <label className="text-sm md:col-span-2"><span className="mb-1 block font-medium">Description</span><textarea className="w-full rounded-lg border p-2 bg-transparent" rows={4} value={courseForm.description} onChange={cf("description")} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Price (INR)</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={courseForm.price} onChange={cfN("price")} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Discount Price (INR)</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={courseForm.discountPrice} onChange={cfN("discountPrice")} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Category</span><select className="w-full rounded-lg border p-2 bg-transparent" value={courseForm.category} onChange={cf("category")}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Instructor</span><input className="w-full rounded-lg border p-2 bg-transparent" value={courseForm.instructor} onChange={cf("instructor")} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Duration (min)</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent" value={courseForm.durationMinutes} onChange={cfN("durationMinutes")} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Rating</span><input type="number" step="0.1" min="0" max="5" className="w-full rounded-lg border p-2 bg-transparent" value={courseForm.rating} onChange={cfN("rating")} /></label>
              <label className="text-sm md:col-span-2"><span className="mb-1 block font-medium">Status</span><select className="w-full rounded-lg border p-2 bg-transparent" value={courseForm.status} onChange={cf("status")}><option value="published">Published</option><option value="draft">Draft</option></select></label>
            </div>
            <div className="flex gap-3 pt-2 border-t dark:border-white/10">
              <button disabled={saving} className="rounded-xl bg-brand-primary px-5 py-2 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : courseModal === "edit" ? "Update Course" : "Create Course"}</button>
              <button type="button" onClick={() => setCourseModal(null)} className="rounded-xl border px-5 py-2 font-semibold">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {syllabusModal && (
        <Modal title={`Syllabus \u2014 ${syllabusModal.title}`} onClose={() => { setSyllabusModal(null); setLessonForm(EMPTY_LESSON); }} wide>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-500">{lessons.length} lesson(s)</p>
              {lessons.length === 0
                ? <p className="py-10 text-center text-sm text-slate-400">No lessons yet. Add one using the form.</p>
                : <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
                    {lessons.map((l, i) => (
                      <div key={l.id} className="rounded-xl border p-3 dark:border-white/10">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{i + 1}. {l.lesson_title}</p>
                            <p className="text-xs text-slate-500">{l.section_title} &middot; {l.duration_minutes}min &middot; Order #{l.order_index}</p>
                            {l.is_preview && <span className="text-xs text-green-600 font-medium">Free Preview</span>}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => setLessonForm({ ...l })} className="rounded border px-2 py-1 text-xs hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">Edit</button>
                            <button onClick={() => onDeleteLesson(l.id)} className="rounded border px-2 py-1 text-xs text-rose-500 hover:bg-rose-50">Del</button>
                          </div>
                        </div>
                        <div className="mt-2">
                          {editingVideoId === l.id
                            ? <div className="flex gap-2">
                                <input className="flex-1 rounded-lg border p-1.5 text-xs bg-transparent" placeholder="YouTube or video URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                                <button onClick={() => onSaveVideoUrl(l.id)} className="rounded-lg bg-brand-primary px-2 py-1 text-xs text-white">Save</button>
                                <button onClick={() => setEditingVideoId(null)} className="rounded-lg border px-2 py-1 text-xs">X</button>
                              </div>
                            : <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 truncate flex-1">{l.video_url ? l.video_url.slice(0, 45) + "..." : "No video"}</span>
                                <button onClick={() => { setEditingVideoId(l.id); setVideoUrl(l.video_url || ""); }} className="rounded border px-2 py-0.5 text-xs hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">{l.video_url ? "Change" : "+ Video"}</button>
                              </div>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
            <div className="rounded-xl border p-4 dark:border-white/10 h-fit sticky top-0">
              <h3 className="mb-3 font-semibold">{lessonForm.id ? "Edit Lesson" : "Add Lesson"}</h3>
              <form onSubmit={onSubmitLesson} className="space-y-3">
                <label className="block text-sm"><span className="mb-1 block font-medium">Section</span><input className="w-full rounded-lg border p-2 bg-transparent text-sm" required placeholder="Getting Started" value={lessonForm.section_title} onChange={e => setLessonForm(s => ({ ...s, section_title: e.target.value }))} /></label>
                <label className="block text-sm"><span className="mb-1 block font-medium">Lesson Title</span><input className="w-full rounded-lg border p-2 bg-transparent text-sm" required placeholder="Introduction" value={lessonForm.lesson_title} onChange={e => setLessonForm(s => ({ ...s, lesson_title: e.target.value }))} /></label>
                <label className="block text-sm"><span className="mb-1 block font-medium">Video URL</span><input className="w-full rounded-lg border p-2 bg-transparent text-sm" placeholder="https://youtube.com/..." value={lessonForm.video_url} onChange={e => setLessonForm(s => ({ ...s, video_url: e.target.value }))} /></label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-sm"><span className="mb-1 block font-medium">Duration (min)</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent text-sm" value={lessonForm.duration_minutes} onChange={e => setLessonForm(s => ({ ...s, duration_minutes: Number(e.target.value) }))} /></label>
                  <label className="block text-sm"><span className="mb-1 block font-medium">Order</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent text-sm" value={lessonForm.order_index} onChange={e => setLessonForm(s => ({ ...s, order_index: Number(e.target.value) }))} /></label>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={lessonForm.is_preview} onChange={e => setLessonForm(s => ({ ...s, is_preview: e.target.checked }))} /> Free Preview</label>
                <div className="flex gap-2 pt-1">
                  <button disabled={lessonSaving} className="flex-1 rounded-xl bg-brand-primary py-2 text-sm font-semibold text-white disabled:opacity-50">{lessonSaving ? "Saving..." : lessonForm.id ? "Update" : "Add Lesson"}</button>
                  <button type="button" onClick={() => setLessonForm(EMPTY_LESSON)} className="rounded-xl border px-3 py-2 text-sm">Reset</button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {progressModal && (
        <Modal title={`Student Progress \u2014 ${progressModal.title}`} onClose={() => { setProgressModal(null); setProgressData(null); }} wide>
          {!progressData
            ? <div className="py-12 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" /></div>
            : progressData.students.length === 0
              ? <p className="py-8 text-center text-sm text-slate-500">No students enrolled yet.</p>
              : <div className="overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead><tr className="border-b dark:border-white/10">{["Student","Email","Progress","Lessons","Enrolled"].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr></thead>
                    <tbody className="divide-y dark:divide-white/10">
                      {progressData.students.map(s => (
                        <tr key={s.student_id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="p-3 font-medium">{s.student_name}</td>
                          <td className="p-3 text-slate-500 text-xs">{s.student_email}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-28 rounded-full bg-slate-200 dark:bg-white/10"><div className="h-2 rounded-full bg-brand-primary transition-all" style={{ width: `${s.progress_percent}%` }} /></div>
                              <span className="text-xs font-bold">{s.progress_percent}%</span>
                            </div>
                          </td>
                          <td className="p-3">{s.lessons_completed}/{s.total_lessons}</td>
                          <td className="p-3 text-xs text-slate-500">{s.enrolled_at ? new Date(s.enrolled_at).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          }
        </Modal>
      )}
    </div>
  );
}
