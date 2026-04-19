import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAdminStudents, updateStudentStatus } from "../../services/adminService";

export default function AdminStudentsPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const load = (p = page) => {
    setLoading(true);
    setError("");
    fetchAdminStudents({ page: p, search, isActive: filter })
      .then((d) => {
        setItems(d.items || []);
        setMeta({ total: d.total || 0, page: d.page || 1, pages: d.pages || 1 });
      })
      .catch(() => {
        setItems([]);
        setError("Unable to load students. Please re-login and try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); setPage(1); }, [search, filter]);
  useEffect(() => { load(page); }, [page]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl font-bold">Students</h1>
        <p className="text-sm text-slate-500">{meta.total} total students</p>
      </div>

      {/* Search and filter */}
      <div className="mt-5 flex flex-wrap gap-3">
        <input
          className="rounded-lg border px-3 py-2 text-sm bg-transparent w-64"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-lg border px-3 py-2 text-sm bg-transparent"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Disabled</option>
        </select>
      </div>

      {error ? <p className="mt-3 rounded-lg border border-rose-300 bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}

      <div className="mt-4 overflow-auto rounded-2xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-50 dark:border-white/10 dark:bg-white/5">
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Orders</th>
              <th className="p-3 font-semibold">Spent</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-white/10">
            {loading ? (
              <tr><td className="p-4 text-slate-500" colSpan={6}>Loading students…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-4 text-slate-500" colSpan={6}>No students found.</td></tr>
            ) : items.map((x) => (
              <tr key={x.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="p-3 font-medium">{x.full_name}</td>
                <td className="p-3 text-slate-500">{x.email}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${x.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {x.is_active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-3 text-slate-500">{x.paid_orders || 0}</td>
                <td className="p-3 text-slate-500">₹{Number((x.total_spent || 0) / 100).toLocaleString("en-IN")}</td>
                <td className="p-3">
                  <button
                    className={`rounded border px-3 py-1 text-xs font-medium transition ${
                      x.is_active ? "border-rose-300 text-rose-600 hover:bg-rose-50" : "border-green-300 text-green-600 hover:bg-green-50"
                    }`}
                    onClick={async () => {
                      await updateStudentStatus(x.id, !x.is_active);
                      toast.success("Student status updated");
                      load(page);
                    }}
                  >
                    {x.is_active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-slate-500">
            Page {meta.page} of {meta.pages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={meta.page >= meta.pages}
              onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
              className="rounded-lg border px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
