import { useEffect, useState } from "react";
import { fetchAdminOrders, fetchOrderDetail, updateOrderStatus } from "../../services/adminService";

export default function AdminOrdersPage() {
  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);
  const load = () => fetchAdminOrders().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Orders</h1>
      <div className="mt-6 overflow-auto rounded-2xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b dark:border-white/10"><th className="p-3">Order</th><th>Student</th><th>Course</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-b dark:border-white/10">
                <td className="p-3">{x.order_id}</td><td>{x.student}</td><td>{x.course}</td><td>₹{(x.amount / 100).toLocaleString()}</td>
                <td>
                  <select className="rounded border p-1 bg-transparent" value={x.status} onChange={async (e) => { await updateOrderStatus(x.id, e.target.value); load(); }}>
                    <option>created</option><option>paid</option><option>failed</option><option>refunded</option>
                  </select>
                </td>
                <td><button className="rounded border px-2 py-1" onClick={async () => setDetail(await fetchOrderDetail(x.id))}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 dark:bg-[#141421]">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Order Details</h2>
              <button className="rounded border px-2 py-1" onClick={() => setDetail(null)}>Close</button>
            </div>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-lg border p-3">Order ID: {detail.order_id}</div>
              <div className="rounded-lg border p-3">Status: {detail.status}</div>
              <div className="rounded-lg border p-3">Amount: ₹{Number((detail.amount || 0) / 100).toLocaleString()}</div>
              <div className="rounded-lg border p-3">Date: {detail.created_at ? new Date(detail.created_at).toLocaleString() : "-"}</div>
              <div className="rounded-lg border p-3">Razorpay Order: {detail.razorpay_order_id || "-"}</div>
              <div className="rounded-lg border p-3">Razorpay Payment: {detail.razorpay_payment_id || "-"}</div>
              <div className="rounded-lg border p-3">Student: {detail.student?.name} ({detail.student?.email})</div>
              <div className="rounded-lg border p-3">Course: {detail.course?.title}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
