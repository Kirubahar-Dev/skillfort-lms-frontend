import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatCard from "../../components/ui/StatCard";
import { fetchAdminDashboard } from "../../services/adminService";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAdminDashboard().then(setData).catch(() => setData(null));
  }, []);

  const stats = data?.stats;
  const orders = data?.recent_orders || [];
  const chartData = orders.slice(0, 6).map((o) => ({ order: o.order_id.slice(-4), amount: Number((o.amount || 0) / 100) }));

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={stats?.total_students ?? 0} />
        <StatCard label="Total Courses" value={stats?.total_courses ?? 0} />
        <StatCard label="Total Revenue" value={`₹${((stats?.total_revenue || 0) / 100).toLocaleString()}`} />
        <StatCard label="Total Orders" value={stats?.total_orders ?? 0} />
      </div>

      <div className="mt-6 overflow-auto rounded-2xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b dark:border-white/10">
              <th className="p-3">Order ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.order_id} className="border-b dark:border-white/10">
                <td className="p-3">{o.order_id}</td>
                <td>{o.student}</td>
                <td>{o.course}</td>
                <td>₹{(o.amount / 100).toLocaleString()}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl border p-4 dark:border-white/10">
        <h2 className="font-semibold">Recent Revenue (INR)</h2>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="order" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#6C63FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
