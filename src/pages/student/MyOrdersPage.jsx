import { useEffect, useState } from "react";
import { getStudentOrders } from "../../services/studentService";

export default function MyOrdersPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getStudentOrders().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-4xl">My Orders</h1>
      <div className="mt-4 overflow-auto rounded-xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b dark:border-white/10"><th className="p-3">Order ID</th><th>Course</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>{items.map((x) => <tr key={x.order_id} className="border-b dark:border-white/10"><td className="p-3">{x.order_id}</td><td>{x.course_id}</td><td>₹{(x.amount / 100).toLocaleString()}</td><td>{x.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
