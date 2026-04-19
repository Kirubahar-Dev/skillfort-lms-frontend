import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCategory, deleteCategory, fetchAdminCategories } from "../../services/adminService";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  const load = () => fetchAdminCategories().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory(name.trim());
      toast.success("Category added");
      setName("");
      load();
    } catch {
      toast.error("Failed to add category");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Categories</h1>
      <form onSubmit={add} className="mt-4 flex gap-2 rounded-xl border p-3 dark:border-white/10">
        <input className="flex-1 rounded border p-2 bg-transparent" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="rounded bg-brand-primary px-4 py-2 text-white">Add</button>
      </form>

      <div className="mt-6 overflow-auto rounded-2xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b dark:border-white/10"><th className="p-3">Name</th><th>Slug</th><th>Courses</th><th>Action</th></tr></thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-b dark:border-white/10">
                <td className="p-3">{x.name}</td><td>{x.slug}</td><td>{x.courses_count}</td>
                <td><button className="rounded border px-2 py-1 text-rose-500" onClick={async () => { await deleteCategory(x.id); toast.success("Deleted"); load(); }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
