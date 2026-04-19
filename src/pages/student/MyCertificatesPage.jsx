import { useEffect, useState } from "react";
import { getStudentCertificates } from "../../services/studentService";

export default function MyCertificatesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getStudentCertificates().then((d) => setItems(d.items || [])).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-4xl">My Certificates</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((x) => (
          <article key={x.certificate_no} className="rounded-xl border p-4 dark:border-white/10">
            <p className="font-semibold">{x.certificate_no}</p>
            <p className="text-sm text-slate-500">Course ID: {x.course_id}</p>
            <p className="mt-2 break-all text-xs text-slate-500">{x.file_path}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
