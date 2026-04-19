import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import {
  createCompany,
  createQuestion,
  createTopic,
  deleteQuestion,
  deleteTopic,
  fetchCompanies,
  fetchCompilerStats,
  fetchInterviewAnalytics,
  fetchInterviewQuestions,
  fetchInterviewTopics,
  fetchTopQuestions,
  updateCompany,
  updateQuestion,
  updateTopic,
} from "../../services/interviewService";

function RichEditor({ value, onChange, placeholder = "Write content..." }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[120px] rounded-lg border border-slate-300 bg-transparent p-3 text-sm outline-none dark:border-white/20",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "");
  }, [value, editor]);

  return <EditorContent editor={editor} placeholder={placeholder} />;
}

function SplitInput({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-white/20"
      />
    </label>
  );
}

export default function AdminInterviewPrepPage() {
  const [tab, setTab] = useState("questions");
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [topQuestions, setTopQuestions] = useState([]);
  const [compilerStats, setCompilerStats] = useState([]);

  const [questionForm, setQuestionForm] = useState({
    id: null,
    title: "",
    body: "",
    domain: "DSA",
    difficulty: "medium",
    type: "coding",
    tags: "arrays,dynamic-programming",
    companies: "Amazon,Google",
    hint: "",
    answer: "",
    status: "published",
  });

  const [topicForm, setTopicForm] = useState({
    id: null,
    name: "",
    slug: "",
    domain: "DSA",
    description: "",
    cheat_sheet: "",
    status: "published",
  });

  const [companyForm, setCompanyForm] = useState({ id: null, name: "", slug: "", logo_url: "", interview_process: "" });

  const reloadAll = async () => {
    try {
      const [q, t, c] = await Promise.all([
        fetchInterviewQuestions({ page: 1, page_size: 100 }),
        fetchInterviewTopics(),
        fetchCompanies(),
      ]);
      setQuestions(q.items || []);
      setTopics(t.items || []);
      setCompanies(c.items || []);
    } catch {
      toast.error("Failed to load admin data");
    }
  };

  const loadAnalytics = async () => {
    try {
      const [ov, tq, cs] = await Promise.all([fetchInterviewAnalytics(), fetchTopQuestions(), fetchCompilerStats()]);
      setAnalytics(ov);
      setTopQuestions(tq.items || []);
      setCompilerStats(cs.items || []);
    } catch {
      toast.error("Analytics unavailable");
    }
  };

  useEffect(() => {
    reloadAll();
    loadAnalytics();
  }, []);

  const saveQuestion = async () => {
    try {
      const payload = {
        title: questionForm.title,
        body: questionForm.body,
        domain: questionForm.domain,
        difficulty: questionForm.difficulty,
        type: questionForm.type,
        tags: questionForm.tags.split(",").map((x) => x.trim()).filter(Boolean),
        companies: questionForm.companies.split(",").map((x) => x.trim()).filter(Boolean),
        hint: questionForm.hint,
        answer: questionForm.answer,
        status: questionForm.status,
      };
      if (questionForm.id) await updateQuestion(questionForm.id, payload);
      else await createQuestion(payload);
      toast.success("Question saved");
      setQuestionForm({ id: null, title: "", body: "", domain: "DSA", difficulty: "medium", type: "coding", tags: "", companies: "", hint: "", answer: "", status: "published" });
      reloadAll();
    } catch {
      toast.error("Unable to save question");
    }
  };

  const saveTopic = async () => {
    try {
      const payload = {
        name: topicForm.name,
        slug: topicForm.slug,
        domain: topicForm.domain,
        description: topicForm.description,
        cheat_sheet: topicForm.cheat_sheet,
        study_resources_json: [],
        status: topicForm.status,
      };
      if (topicForm.id) await updateTopic(topicForm.id, payload);
      else await createTopic(payload);
      toast.success("Topic saved");
      setTopicForm({ id: null, name: "", slug: "", domain: "DSA", description: "", cheat_sheet: "", status: "published" });
      reloadAll();
    } catch {
      toast.error("Unable to save topic");
    }
  };

  const saveCompany = async () => {
    try {
      const payload = { ...companyForm };
      if (companyForm.id) await updateCompany(companyForm.id, payload);
      else await createCompany(payload);
      toast.success("Company saved");
      setCompanyForm({ id: null, name: "", slug: "", logo_url: "", interview_process: "" });
      reloadAll();
    } catch {
      toast.error("Unable to save company");
    }
  };

  const compilerChart = useMemo(
    () => compilerStats.map((x, i) => ({ ...x, color: ["#6C63FF", "#FF6584", "#48BB78", "#ECC94B"][i % 4] })),
    [compilerStats]
  );

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Interview Prep Admin</h1>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {[
          ["Questions", "questions"],
          ["Topics", "topics"],
          ["Companies", "companies"],
          ["Analytics", "analytics"],
        ].map(([label, key]) => (
          <button key={key} className={`rounded-lg border px-3 py-1 ${tab === key ? "bg-brand-primary text-white" : ""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "questions" ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-xl border p-4 dark:border-white/10">
            <h2 className="font-semibold">Questions Manager</h2>
            <div className="mt-3 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b dark:border-white/10">
                    <th className="py-2">Title</th>
                    <th>Domain</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id} className="border-b dark:border-white/10">
                      <td className="py-2">{q.title}</td>
                      <td>{q.domain}</td>
                      <td>{q.difficulty}</td>
                      <td>{q.status || "published"}</td>
                      <td className="space-x-2 py-2">
                        <button
                          className="rounded border px-2 py-1"
                          onClick={() =>
                            setQuestionForm({
                              id: q.id,
                              title: q.title,
                              body: q.body,
                              domain: q.domain,
                              difficulty: q.difficulty,
                              type: q.type,
                              tags: (q.tags || []).join(", "),
                              companies: (q.companies || []).join(", "),
                              hint: q.hint || "",
                              answer: q.answer || "",
                              status: "published",
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="rounded border px-2 py-1 text-rose-500"
                          onClick={async () => {
                            await deleteQuestion(q.id);
                            reloadAll();
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border p-4 dark:border-white/10">
            <h2 className="font-semibold">Add/Edit Question</h2>
            <div className="mt-3 grid gap-3">
              <SplitInput label="Title" value={questionForm.title} onChange={(v) => setQuestionForm((s) => ({ ...s, title: v }))} />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Body (TipTap)</span>
                <RichEditor value={questionForm.body} onChange={(v) => setQuestionForm((s) => ({ ...s, body: v }))} />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <SplitInput label="Domain" value={questionForm.domain} onChange={(v) => setQuestionForm((s) => ({ ...s, domain: v }))} />
                <SplitInput label="Difficulty" value={questionForm.difficulty} onChange={(v) => setQuestionForm((s) => ({ ...s, difficulty: v }))} />
                <SplitInput label="Type" value={questionForm.type} onChange={(v) => setQuestionForm((s) => ({ ...s, type: v }))} />
              </div>
              <SplitInput label="Tags (comma separated)" value={questionForm.tags} onChange={(v) => setQuestionForm((s) => ({ ...s, tags: v }))} />
              <SplitInput label="Companies (comma separated)" value={questionForm.companies} onChange={(v) => setQuestionForm((s) => ({ ...s, companies: v }))} />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hint</span>
                <RichEditor value={questionForm.hint} onChange={(v) => setQuestionForm((s) => ({ ...s, hint: v }))} />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Answer</span>
                <RichEditor value={questionForm.answer} onChange={(v) => setQuestionForm((s) => ({ ...s, answer: v }))} />
              </div>
              <button className="rounded-lg bg-brand-primary py-2 text-white" onClick={saveQuestion}>Save Question</button>
            </div>
          </section>
        </div>
      ) : null}

      {tab === "topics" ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-xl border p-4 dark:border-white/10">
            <h2 className="font-semibold">Topics</h2>
            <div className="mt-3 space-y-2 text-sm">
              {topics.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-3 dark:border-white/10">
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.slug} • {t.domain}</p>
                  </div>
                  <div className="space-x-2">
                    <button className="rounded border px-2 py-1" onClick={() => setTopicForm({ ...t, domain: t.domain, description: t.description || "", cheat_sheet: t.cheat_sheet || "", status: t.status || "published" })}>Edit</button>
                    <button className="rounded border px-2 py-1 text-rose-500" onClick={async () => { await deleteTopic(t.id); reloadAll(); }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border p-4 dark:border-white/10">
            <h2 className="font-semibold">Add/Edit Topic</h2>
            <div className="mt-3 grid gap-3">
              <SplitInput label="Name" value={topicForm.name} onChange={(v) => setTopicForm((s) => ({ ...s, name: v }))} />
              <SplitInput label="Slug" value={topicForm.slug} onChange={(v) => setTopicForm((s) => ({ ...s, slug: v }))} />
              <SplitInput label="Domain" value={topicForm.domain} onChange={(v) => setTopicForm((s) => ({ ...s, domain: v }))} />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</span>
                <RichEditor value={topicForm.description} onChange={(v) => setTopicForm((s) => ({ ...s, description: v }))} />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cheat Sheet</span>
                <RichEditor value={topicForm.cheat_sheet} onChange={(v) => setTopicForm((s) => ({ ...s, cheat_sheet: v }))} />
              </div>
              <button className="rounded-lg bg-brand-primary py-2 text-white" onClick={saveTopic}>Save Topic</button>
            </div>
          </section>
        </div>
      ) : null}

      {tab === "companies" ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-xl border p-4 dark:border-white/10">
            <h2 className="font-semibold">Companies</h2>
            <div className="mt-3 space-y-2 text-sm">
              {companies.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3 dark:border-white/10">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-slate-500">Tagged: {c.questions_tagged || 0}</p>
                  </div>
                  <button className="rounded border px-2 py-1" onClick={() => setCompanyForm(c)}>Edit</button>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border p-4 dark:border-white/10">
            <h2 className="font-semibold">Add/Edit Company</h2>
            <div className="mt-3 grid gap-3">
              <SplitInput label="Name" value={companyForm.name} onChange={(v) => setCompanyForm((s) => ({ ...s, name: v }))} />
              <SplitInput label="Slug" value={companyForm.slug} onChange={(v) => setCompanyForm((s) => ({ ...s, slug: v }))} />
              <SplitInput label="Logo URL" value={companyForm.logo_url || ""} onChange={(v) => setCompanyForm((s) => ({ ...s, logo_url: v }))} />
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interview Process</span>
                <textarea className="min-h-[120px] w-full rounded-lg border border-slate-300 bg-transparent p-2 text-sm dark:border-white/20" value={companyForm.interview_process || ""} onChange={(e) => setCompanyForm((s) => ({ ...s, interview_process: e.target.value }))} />
              </label>
              <button className="rounded-lg bg-brand-primary py-2 text-white" onClick={saveCompany}>Save Company</button>
            </div>
          </section>
        </div>
      ) : null}

      {tab === "analytics" ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-xl border p-4 dark:border-white/10">
            <h2 className="font-semibold">Overview</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-3 dark:border-white/10"><p className="text-sm">Question Views</p><p className="text-2xl font-bold">{analytics?.question_views_30d ?? 0}</p></div>
              <div className="rounded-lg border p-3 dark:border-white/10"><p className="text-sm">Bookmarks</p><p className="text-2xl font-bold">{analytics?.bookmarks ?? 0}</p></div>
              <div className="rounded-lg border p-3 dark:border-white/10"><p className="text-sm">Compiler Sessions</p><p className="text-2xl font-bold">{analytics?.compiler_sessions ?? 0}</p></div>
              <div className="rounded-lg border p-3 dark:border-white/10"><p className="text-sm">Mock Completions</p><p className="text-2xl font-bold">{analytics?.mock_completions ?? 0}</p></div>
            </div>
          </section>

          <section className="rounded-xl border p-4 dark:border-white/10">
            <h2 className="font-semibold">Top Questions</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topQuestions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#6C63FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-xl border p-4 dark:border-white/10 lg:col-span-2">
            <h2 className="font-semibold">Compiler Language Usage</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={compilerChart} dataKey="count" nameKey="language" cx="50%" cy="50%" outerRadius={100} label>
                    {compilerChart.map((entry) => (
                      <Cell key={entry.language} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
