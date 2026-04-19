import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCoupon, fetchAdminCoupons, updateCouponStatus } from "../../services/adminService";

export default function AdminCouponsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ code: "", discount_percent: 10, max_uses: 100 });
  const load = () => fetchAdminCoupons().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({ ...form, discount_percent: Number(form.discount_percent), max_uses: Number(form.max_uses) });
      toast.success("Coupon added");
      setForm({ code: "", discount_percent: 10, max_uses: 100 });
      load();
    } catch {
      toast.error("Failed to add coupon");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Coupons</h1>
      <form onSubmit={add} className="mt-4 grid gap-2 rounded-xl border p-3 dark:border-white/10 md:grid-cols-4">
        <label className="text-sm"><span className="mb-1 block">Coupon Code</span><input className="w-full rounded border p-2 bg-transparent" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></label>
        <label className="text-sm"><span className="mb-1 block">Discount %</span><input className="w-full rounded border p-2 bg-transparent" type="number" placeholder="Discount %" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} /></label>
        <label className="text-sm"><span className="mb-1 block">Max Uses</span><input className="w-full rounded border p-2 bg-transparent" type="number" placeholder="Max uses" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} /></label>
        <button className="h-fit self-end rounded bg-brand-primary px-4 py-2 text-white">Add Coupon</button>
      </form>

      <div className="mt-6 overflow-auto rounded-2xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b dark:border-white/10"><th className="p-3">Code</th><th>Discount</th><th>Usage</th><th>Utilized</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-b dark:border-white/10">
                <td className="p-3">{x.code}</td><td>{x.discount_percent}%</td><td>{x.used_count}/{x.max_uses}</td><td>{x.utilized_percent || 0}%</td>
                <td><button className="rounded border px-2 py-1" onClick={async () => { await updateCouponStatus(x.id, !x.is_active); load(); }}>{x.is_active ? "Disable" : "Enable"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
