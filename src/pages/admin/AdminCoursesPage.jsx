import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCourse, createCourseLesson, deleteCourse, deleteCourseLesson, fetchCourseLessons, updateCourse, updateCourseLesson } from "../../services/courseService";
import { fetchAdminCourseInsights } from "../../services/adminService";
import { getAdminCourseProgress, updateLessonVideo, uploadLessonVideoFile } from "../../services/learnService";
import {
  adminGetLessonQuestions, adminGenerateQuestions, adminApproveQuestion,
  adminRejectQuestion, adminDeleteQuestion, adminAddQuestion, adminUpdateQuestion,
} from "../../services/quizService";
import api from "../../services/api";

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
  const [progressData, setProgressData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [thumbUploading, setThumbUploading] = useState(false);
  const [formVideoUploading, setFormVideoUploading] = useState(false);
  const [formVideoProgress, setFormVideoProgress] = useState(0);

  // Questions panel
  const [questionPanelId, setQuestionPanelId] = useState(null);   // lesson id whose panel is open
  const [lessonQuestions, setLessonQuestions] = useState({});      // {lessonId: []}
  const [generatingId, setGeneratingId] = useState(null);
  const [addQForm, setAddQForm] = useState(null);                  // lessonId or null
  const [newQ, setNewQ] = useState({ question:"",option_a:"",option_b:"",option_c:"",option_d:"",correct_option:"A",explanation:"" });
  const [editQId, setEditQId] = useState(null);
  const [editQData, setEditQData] = useState({});

  const reloadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCourseInsights();
      // API returns { items: [...], total: N }
      const list = Array.isArray(data) ? data : (data.courses || data.items || []);
      setItems(list);
    } catch { setItems([]); } finally { setLoading(false); }
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

  const onUploadVideoFile = async (lessonId, file) => {
    if (!file) return;
    setUploading(true); setUploadProgress(0);
    const interval = setInterval(() => setUploadProgress(p => Math.min(p + 8, 90)), 300);
    try {
      const res = await uploadLessonVideoFile(lessonId, file);
      clearInterval(interval); setUploadProgress(100);
      toast.success("Video uploaded successfully!");
      const data = await fetchCourseLessons(syllabusModal.id);
      setLessons(data || []);
      setTimeout(() => { setUploadProgress(0); setUploading(false); }, 800);
    } catch {
      clearInterval(interval);
      toast.error("Upload failed. Check file size (max 500MB) and format.");
      setUploading(false); setUploadProgress(0);
    }
  };
  const openProgress = async (course) => {
    setProgressModal(course); setProgressData(null);
    try { const d = await getAdminCourseProgress(course.id); setProgressData(d); }
    catch { toast.error("Unable to load progress"); }
  };

  const cf = (key) => (e) => setCourseForm(s => ({ ...s, [key]: e.target.value }));
  const cfN = (key) => (e) => setCourseForm(s => ({ ...s, [key]: Number(e.target.value || 0) }));

  const uploadVideoForForm = async (file) => {
    if (!file) return;
    setFormVideoUploading(true); setFormVideoProgress(0);
    const ticker = setInterval(() => setFormVideoProgress(p => Math.min(p + 6, 88)), 400);
    try {
      // If editing an existing lesson, upload directly (saves to DB + returns URL)
      if (lessonForm.id) {
        const res = await uploadLessonVideoFile(lessonForm.id, file);
        clearInterval(ticker); setFormVideoProgress(100);
        setLessonForm(s => ({ ...s, video_url: res.video_url }));
        toast.success("Video uploaded & saved!");
        // Refresh lesson list
        const data = await fetchCourseLessons(syllabusModal.id);
        setLessons(data || []);
      } else {
        // New lesson — upload to generic endpoint, get URL, fill form field
        const fd = new FormData(); fd.append("file", file);
        const { data } = await api.post("/api/admin/upload-video", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 600000,
        });
        clearInterval(ticker); setFormVideoProgress(100);
        setLessonForm(s => ({ ...s, video_url: data.url }));
        toast.success("Video uploaded! Save the lesson to attach it.");
      }
    } catch (e) {
      clearInterval(ticker);
      toast.error(e?.response?.data?.detail || "Video upload failed");
    } finally {
      setTimeout(() => { setFormVideoUploading(false); setFormVideoProgress(0); }, 800);
    }
  };

  const uploadThumbnail = async (file) => {
    if (!file) return;
    setThumbUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const { data } = await api.post("/api/admin/upload-thumbnail", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setCourseForm(s => ({ ...s, thumbnail: data.url }));
      toast.success("Thumbnail uploaded!");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Upload failed");
    } finally { setThumbUploading(false); }
  };

  // ── Question panel handlers ───────────────────────────────────────────────
  const loadQuestions = async (lessonId) => {
    try {
      const qs = await adminGetLessonQuestions(lessonId);
      setLessonQuestions(prev => ({ ...prev, [lessonId]: qs }));
    } catch { toast.error("Could not load questions"); }
  };

  const toggleQuestionPanel = (lessonId) => {
    if (questionPanelId === lessonId) { setQuestionPanelId(null); return; }
    setQuestionPanelId(lessonId);
    loadQuestions(lessonId);
  };

  const handleGenerate = async (lessonId) => {
    setGeneratingId(lessonId);
    try {
      const res = await adminGenerateQuestions(lessonId);
      toast.success(`✨ ${res.generated} questions generated! Review and approve below.`);
      await loadQuestions(lessonId);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Generation failed. Check ANTHROPIC_API_KEY.");
    } finally { setGeneratingId(null); }
  };

  const handleApprove = async (lessonId, qId) => {
    await adminApproveQuestion(qId);
    await loadQuestions(lessonId);
    toast.success("Question approved ✓");
  };
  const handleReject = async (lessonId, qId) => {
    await adminRejectQuestion(qId);
    await loadQuestions(lessonId);
  };
  const handleDeleteQ = async (lessonId, qId) => {
    if (!window.confirm("Delete this question?")) return;
    await adminDeleteQuestion(qId);
    await loadQuestions(lessonId);
    toast.success("Deleted");
  };

  const handleAddQ = async (lessonId) => {
    if (!newQ.question.trim()) { toast.error("Question text required"); return; }
    try {
      await adminAddQuestion(lessonId, newQ);
      toast.success("Question added & approved");
      setAddQForm(null);
      setNewQ({ question:"",option_a:"",option_b:"",option_c:"",option_d:"",correct_option:"A",explanation:"" });
      await loadQuestions(lessonId);
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed to add"); }
  };

  const handleSaveEditQ = async (lessonId, qId) => {
    try {
      await adminUpdateQuestion(qId, editQData);
      setEditQId(null); setEditQData({});
      await loadQuestions(lessonId);
      toast.success("Question updated");
    } catch { toast.error("Update failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold">Courses</h1>
          <p className="mt-1 text-sm text-slate-500">{items.length} total courses</p>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-brand-primary px-4 py-2 font-semibold text-slate-900 hover:opacity-90">+ New Course</button>
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
              <div className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium">Thumbnail</span>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input className="w-full rounded-lg border p-2 bg-transparent text-sm" placeholder="/images/python-logo.png or paste URL" value={courseForm.thumbnail} onChange={cf("thumbnail")} />
                  </div>
                  {courseForm.thumbnail && (
                    <img src={courseForm.thumbnail} alt="thumb" className="h-10 w-16 rounded-lg object-cover border flex-shrink-0" onError={e => e.target.style.display='none'} />
                  )}
                </div>
                <label className={`mt-2 flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:border-brand-primary hover:text-brand-primary transition ${thumbUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  {thumbUploading ? "Uploading…" : "Upload Image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" disabled={thumbUploading} onChange={e => uploadThumbnail(e.target.files[0])} />
                </label>
              </div>
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
              <button disabled={saving} className="rounded-xl bg-brand-primary px-5 py-2 font-semibold text-slate-900 disabled:opacity-50">{saving ? "Saving..." : courseModal === "edit" ? "Update Course" : "Create Course"}</button>
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
                            <button onClick={() => toggleQuestionPanel(l.id)} className={`rounded border px-2 py-1 text-xs ${questionPanelId === l.id ? "bg-brand-primary/20 border-brand-primary text-brand-primary" : "hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10"}`}>
                              📝 Quiz
                            </button>
                            <button onClick={() => onDeleteLesson(l.id)} className="rounded border px-2 py-1 text-xs text-rose-500 hover:bg-rose-50">Del</button>
                          </div>
                        </div>
                        {/* ── Video section (always visible) ── */}
                        <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/3">
                          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>
                            Video
                            {l.video_url && <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">✓ Set</span>}
                          </p>

                          {/* URL input row */}
                          <div className="flex gap-2 mb-2">
                            <input
                              className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-brand-primary dark:border-white/10 dark:bg-white/5"
                              placeholder="Paste YouTube / video URL…"
                              defaultValue={l.video_url || ""}
                              id={`video-url-${l.id}`}
                            />
                            <button
                              onClick={() => {
                                const val = document.getElementById(`video-url-${l.id}`)?.value || "";
                                updateLessonVideo(l.id, val)
                                  .then(() => { toast.success("Video URL saved"); fetchCourseLessons(syllabusModal.id).then(d => setLessons(d || [])); })
                                  .catch(() => toast.error("Unable to save URL"));
                              }}
                              className="rounded-lg bg-brand-primary px-2.5 py-1.5 text-xs font-semibold text-slate-900 hover:opacity-90"
                            >
                              Save URL
                            </button>
                          </div>

                          {/* Upload file row */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">or upload a file:</span>
                            <label className={`flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-brand-primary hover:text-brand-primary dark:border-white/20 dark:bg-white/5 ${uploading && editingVideoId === l.id ? "opacity-50 cursor-not-allowed" : ""}`}>
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                              </svg>
                              {uploading && editingVideoId === l.id ? "Uploading…" : "Upload Video File"}
                              <input
                                type="file"
                                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                                className="hidden"
                                disabled={uploading}
                                onChange={e => {
                                  if (e.target.files[0]) {
                                    setEditingVideoId(l.id);
                                    onUploadVideoFile(l.id, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                            <span className="text-xs text-slate-400">mp4 · webm · mov (max 500MB)</span>
                          </div>

                          {/* Upload progress bar */}
                          {uploading && editingVideoId === l.id && uploadProgress > 0 && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Uploading…</span><span>{uploadProgress}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
                                <div className="h-2 rounded-full bg-brand-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ── Questions Panel ── */}
                        {questionPanelId === l.id && (
                          <div className="mt-3 rounded-xl border-2 border-brand-primary/30 bg-brand-primary/5 p-3">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                              <p className="text-xs font-bold uppercase tracking-wide text-brand-primary flex items-center gap-1.5">
                                📝 Quiz Questions
                                {(lessonQuestions[l.id] || []).length > 0 && (
                                  <span className="rounded-full bg-brand-primary text-slate-900 px-1.5 py-0.5 text-xs">
                                    {(lessonQuestions[l.id] || []).filter(q => q.status === "approved").length} approved
                                  </span>
                                )}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleGenerate(l.id)}
                                  disabled={generatingId === l.id}
                                  className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-slate-900 hover:opacity-90 disabled:opacity-60"
                                >
                                  {generatingId === l.id ? (
                                    <><svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Generating…</>
                                  ) : "⚡ Generate with AI"}
                                </button>
                                <button
                                  onClick={() => setAddQForm(addQForm === l.id ? null : l.id)}
                                  className="rounded-lg border border-brand-primary/40 px-3 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-primary/10"
                                >
                                  + Add Manually
                                </button>
                              </div>
                            </div>

                            {/* Add manually form */}
                            {addQForm === l.id && (
                              <div className="mb-3 rounded-lg border border-brand-primary/20 bg-white p-3 dark:bg-white/5 space-y-2">
                                <p className="text-xs font-semibold text-slate-500 mb-2">New Question</p>
                                <textarea rows={2} placeholder="Question text" className="w-full rounded-lg border p-2 text-xs bg-transparent" value={newQ.question} onChange={e => setNewQ(s => ({...s, question: e.target.value}))} />
                                <div className="grid grid-cols-2 gap-2">
                                  {["A","B","C","D"].map(opt => (
                                    <input key={opt} placeholder={`Option ${opt}`} className="rounded-lg border p-2 text-xs bg-transparent" value={newQ[`option_${opt.toLowerCase()}`]} onChange={e => setNewQ(s => ({...s, [`option_${opt.toLowerCase()}`]: e.target.value}))} />
                                  ))}
                                </div>
                                <div className="flex gap-2 items-center">
                                  <label className="text-xs font-medium">Correct:</label>
                                  {["A","B","C","D"].map(opt => (
                                    <label key={opt} className={`flex items-center gap-1 cursor-pointer rounded-lg px-2 py-1 text-xs border ${newQ.correct_option === opt ? "border-brand-primary bg-brand-primary text-slate-900" : "border-slate-200 dark:border-white/10"}`}>
                                      <input type="radio" className="sr-only" checked={newQ.correct_option === opt} onChange={() => setNewQ(s => ({...s, correct_option: opt}))} /> {opt}
                                    </label>
                                  ))}
                                </div>
                                <input placeholder="Explanation (optional)" className="w-full rounded-lg border p-2 text-xs bg-transparent" value={newQ.explanation} onChange={e => setNewQ(s => ({...s, explanation: e.target.value}))} />
                                <div className="flex gap-2">
                                  <button onClick={() => handleAddQ(l.id)} className="rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-slate-900">Save Question</button>
                                  <button onClick={() => setAddQForm(null)} className="rounded-lg border px-3 py-1.5 text-xs">Cancel</button>
                                </div>
                              </div>
                            )}

                            {/* Question list */}
                            {(lessonQuestions[l.id] || []).length === 0 ? (
                              <p className="py-4 text-center text-xs text-slate-400">
                                No questions yet. Click <strong>⚡ Generate with AI</strong> to auto-generate from lesson content.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {(lessonQuestions[l.id] || []).map((q, qi) => (
                                  <div key={q.id} className={`rounded-lg border p-3 text-xs ${q.status === "approved" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/20 dark:bg-emerald-900/10" : q.status === "rejected" ? "border-red-200 bg-red-50 dark:border-red-800/20 dark:bg-red-900/10 opacity-60" : "border-amber-200 bg-amber-50 dark:border-amber-800/20 dark:bg-amber-900/10"}`}>
                                    {editQId === q.id ? (
                                      /* Edit form */
                                      <div className="space-y-2">
                                        <textarea rows={2} className="w-full rounded border p-1.5 text-xs bg-white dark:bg-white/5" value={editQData.question ?? q.question} onChange={e => setEditQData(s => ({...s, question: e.target.value}))} />
                                        <div className="grid grid-cols-2 gap-1.5">
                                          {["A","B","C","D"].map(opt => (
                                            <input key={opt} placeholder={`Option ${opt}`} className="rounded border p-1.5 text-xs bg-white dark:bg-white/5" value={editQData[`option_${opt.toLowerCase()}`] ?? q[`option_${opt.toLowerCase()}`]} onChange={e => setEditQData(s => ({...s, [`option_${opt.toLowerCase()}`]: e.target.value}))} />
                                          ))}
                                        </div>
                                        <div className="flex gap-1.5 items-center">
                                          <span className="text-xs font-medium">Correct:</span>
                                          {["A","B","C","D"].map(opt => (
                                            <label key={opt} className={`cursor-pointer rounded px-1.5 py-0.5 border text-xs ${(editQData.correct_option ?? q.correct_option) === opt ? "bg-brand-primary text-slate-900 border-brand-primary" : "border-slate-200 dark:border-white/10"}`}>
                                              <input type="radio" className="sr-only" checked={(editQData.correct_option ?? q.correct_option) === opt} onChange={() => setEditQData(s => ({...s, correct_option: opt}))} /> {opt}
                                            </label>
                                          ))}
                                        </div>
                                        <input placeholder="Explanation" className="w-full rounded border p-1.5 text-xs bg-white dark:bg-white/5" value={editQData.explanation ?? q.explanation ?? ""} onChange={e => setEditQData(s => ({...s, explanation: e.target.value}))} />
                                        <div className="flex gap-1.5">
                                          <button onClick={() => handleSaveEditQ(l.id, q.id)} className="rounded bg-brand-primary px-2 py-1 text-xs font-semibold text-slate-900">Save</button>
                                          <button onClick={() => { setEditQId(null); setEditQData({}); }} className="rounded border px-2 py-1 text-xs">Cancel</button>
                                        </div>
                                      </div>
                                    ) : (
                                      /* View mode */
                                      <>
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                          <p className="font-semibold text-xs leading-snug flex-1">
                                            Q{qi + 1}. {q.question}
                                          </p>
                                          <div className="flex gap-1 flex-shrink-0">
                                            <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${q.status === "approved" ? "bg-emerald-200 text-emerald-800" : q.status === "rejected" ? "bg-red-200 text-red-800" : "bg-amber-200 text-amber-800"}`}>
                                              {q.status}
                                            </span>
                                            {q.source === "ai" && <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700">AI</span>}
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 mb-1.5">
                                          {["A","B","C","D"].map(opt => (
                                            <div key={opt} className={`rounded px-2 py-1 text-xs ${q.correct_option === opt ? "bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-900/30 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"}`}>
                                              {opt}. {q[`option_${opt.toLowerCase()}`]}
                                            </div>
                                          ))}
                                        </div>
                                        {q.explanation && <p className="text-slate-400 text-xs italic mb-1.5">💡 {q.explanation}</p>}
                                        <div className="flex gap-1 pt-1 border-t border-black/5 dark:border-white/10">
                                          {q.status !== "approved" && <button onClick={() => handleApprove(l.id, q.id)} className="rounded bg-emerald-500 px-2 py-0.5 text-xs text-white hover:bg-emerald-600">✓ Approve</button>}
                                          {q.status !== "rejected" && <button onClick={() => handleReject(l.id, q.id)} className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 hover:bg-red-200">✗ Reject</button>}
                                          <button onClick={() => { setEditQId(q.id); setEditQData({}); }} className="rounded border px-2 py-0.5 text-xs hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">Edit</button>
                                          <button onClick={() => handleDeleteQ(l.id, q.id)} className="rounded border px-2 py-0.5 text-xs text-rose-500 hover:bg-rose-50">Delete</button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
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
                <div className="block text-sm">
                  <span className="mb-1 block font-medium">Video</span>
                  {/* URL input */}
                  <input
                    className="w-full rounded-lg border p-2 bg-transparent text-sm"
                    placeholder="Paste YouTube / direct video URL…"
                    value={lessonForm.video_url}
                    onChange={e => setLessonForm(s => ({ ...s, video_url: e.target.value }))}
                  />
                  {/* File upload button */}
                  <label className={`mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 transition hover:border-brand-primary hover:text-brand-primary dark:border-white/20 ${formVideoUploading ? "opacity-60 cursor-not-allowed" : ""}`}>
                    {formVideoUploading ? (
                      <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Uploading {formVideoProgress}%</>
                    ) : (
                      <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Upload Video File (mp4 / webm / mov)</>
                    )}
                    <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo" className="hidden" disabled={formVideoUploading} onChange={e => { if (e.target.files[0]) uploadVideoForForm(e.target.files[0]); }} />
                  </label>
                  {formVideoUploading && (
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10">
                      <div className="h-1.5 rounded-full bg-brand-primary transition-all duration-300" style={{ width: `${formVideoProgress}%` }} />
                    </div>
                  )}
                  {lessonForm.video_url && <p className="mt-1 text-xs text-emerald-600 truncate">✓ {lessonForm.video_url}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-sm"><span className="mb-1 block font-medium">Duration (min)</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent text-sm" value={lessonForm.duration_minutes} onChange={e => setLessonForm(s => ({ ...s, duration_minutes: Number(e.target.value) }))} /></label>
                  <label className="block text-sm"><span className="mb-1 block font-medium">Order</span><input type="number" className="w-full rounded-lg border p-2 bg-transparent text-sm" value={lessonForm.order_index} onChange={e => setLessonForm(s => ({ ...s, order_index: Number(e.target.value) }))} /></label>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={lessonForm.is_preview} onChange={e => setLessonForm(s => ({ ...s, is_preview: e.target.checked }))} /> Free Preview</label>
                <div className="flex gap-2 pt-1">
                  <button disabled={lessonSaving} className="flex-1 rounded-xl bg-brand-primary py-2 text-sm font-semibold text-slate-900 disabled:opacity-50">{lessonSaving ? "Saving..." : lessonForm.id ? "Update" : "Add Lesson"}</button>
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
