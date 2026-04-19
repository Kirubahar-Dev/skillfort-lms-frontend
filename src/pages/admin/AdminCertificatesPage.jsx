import { useEffect, useState } from "react";
import { fetchAdminCertificates } from "../../services/adminService";

export default function AdminCertificatesPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchAdminCertificates().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Certificates</h1>
      <div className="mt-6 overflow-auto rounded-2xl border dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b dark:border-white/10"><th className="p-3">Certificate No</th><th>Student</th><th>Course</th><th>File</th></tr></thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-b dark:border-white/10">
                <td className="p-3">{x.certificate_no}</td><td>{x.student}</td><td>{x.course}</td><td className="break-all text-xs">{x.file_path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
