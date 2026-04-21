import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createInstructor, fetchAdminInstructors, fetchInstructorHistory } from "../../services/adminService";

export default function AdminInstructorsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ full_name: "", email: "", password: "Instructor@123" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    fetchAdminInstructors()
      .then((d) => setItems(d.items || []))
      .catch(() => {
        setItems([]);
        setError("Unable to load instructors.");
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createInstructor(form);
      toast.success("Instructor created");
      setForm({ full_name: "", email: "", password: "Instructor@123" });
      load();
    } catch {
      toast.error("Failed to create instructor");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Instructors</h1>
      {error ? <p className="mt-3 rounded-lg border border-rose-300 bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}
      <form onSubmit={submit} className="mt-4 grid gap-2 rounded-xl border p-3 dark:border-white/10 md:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block">Instructor Name</span>
          <input className="w-full rounded border p-2 bg-transparent" placeholder="Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block">Instructor Email</span>
          <input className="w-full rounded border p-2 bg-transparent" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block">Temporary Password</span>
          <input className="w-full rounded border p-2 bg-transparent" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="h-fit self-end rounded bg-brand-primary px-3 py-2 text-slate-900">Add Instructor</button>
      </form>

      <div className="mt-6 overflow-auto rounded-2xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b dark:border-white/10"><th className="p-3">Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td className="p-3 text-slate-500" colSpan={5}>Loading instructors...</td></tr> : null}
            {!loading && items.length === 0 ? <tr><td className="p-3 text-slate-500" colSpan={5}>No instructors found.</td></tr> : null}
            {items.map((x) => (
              <tr key={x.id} className="border-b dark:border-white/10">
                <td className="p-3">{x.full_name}</td>
                <td>{x.email}</td>
                <td>{x.is_active ? "Active" : "Disabled"}</td>
                <td>{x.created_at ? new Date(x.created_at).toLocaleDateString() : "-"}</td>
                <td>
                  <button
                    className="rounded border px-2 py-1"
                    onClick={async () => {
                      const data = await fetchInstructorHistory(x.id);
                      setHistory(data);
                    }}
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-5 dark:bg-[#141421]">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">{history.full_name}</h2>
              <button className="rounded border px-2 py-1" onClick={() => setHistory(null)}>Close</button>
            </div>
            <p className="mt-1 text-sm text-slate-500">{history.email}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border p-3 text-sm">Joined: {history.joined_at ? new Date(history.joined_at).toLocaleDateString() : "-"}</div>
              <div className="rounded-lg border p-3 text-sm">Courses: {history.courses_count}</div>
              <div className="rounded-lg border p-3 text-sm">Enrollments: {history.total_enrollments}</div>
              <div className="rounded-lg border p-3 text-sm">Revenue: ₹{Number((history.total_revenue || 0) / 100).toLocaleString("en-IN")}</div>
            </div>
            <h3 className="mt-5 font-semibold">Course History</h3>
            <div className="mt-2 space-y-2 text-sm">
              {(history.courses || []).map((c) => (
                <div key={c.id} className="rounded-lg border p-3">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-slate-500">Enrollments: {c.enrollments} | Revenue: ₹{Number((c.revenue || 0) / 100).toLocaleString("en-IN")} | Status: {c.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
