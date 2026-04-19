import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAdminSettings, saveAdminSetting } from "../../services/adminService";

export default function AdminSettingsPage() {
  const [items, setItems] = useState([]);

  const load = () => fetchAdminSettings().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const save = async (key, value) => {
    try {
      await saveAdminSetting(key, value);
      toast.success("Saved");
      load();
    } catch {
      toast.error("Failed to save setting");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Settings</h1>
      <div className="mt-6 grid gap-3">
        {items.map((x) => (
          <div key={x.id || x.key} className="grid gap-2 rounded-xl border p-3 dark:border-white/10 md:grid-cols-[220px_1fr_120px]">
            <p className="self-center text-sm font-semibold">{x.key}</p>
            <input
              className="rounded border p-2 bg-transparent"
              value={x.value}
              onChange={(e) => setItems((prev) => prev.map((p) => (p.key === x.key ? { ...p, value: e.target.value } : p)))}
            />
            <button className="rounded bg-brand-primary px-3 py-2 text-white" onClick={() => save(x.key, x.value)}>Save</button>
          </div>
        ))}
      </div>
    </div>
  );
}
