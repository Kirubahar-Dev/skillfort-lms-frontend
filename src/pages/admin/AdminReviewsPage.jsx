import { useEffect, useState } from "react";
import { fetchAdminReviews, updateReviewStatus } from "../../services/adminService";

export default function AdminReviewsPage() {
  const [items, setItems] = useState([]);
  const load = () => fetchAdminReviews().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Reviews</h1>
      <div className="mt-6 overflow-auto rounded-2xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b dark:border-white/10"><th className="p-3">Student</th><th>Course</th><th>Rating</th><th>Comment</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-b dark:border-white/10">
                <td className="p-3">{x.student}</td><td>{x.course}</td><td>{x.rating}/5</td><td>{x.comment}</td>
                <td>
                  <select className="rounded border p-1 bg-transparent" value={x.status} onChange={async (e) => { await updateReviewStatus(x.id, e.target.value); load(); }}>
                    <option>pending</option><option>approved</option><option>rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
