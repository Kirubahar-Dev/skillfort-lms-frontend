import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCertificateInfo, downloadCertificatePdf } from "../../services/learnService";
import { useAuth } from "../../context/AuthContext";

export default function CertificatePage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCertificateInfo(courseId)
      .then(setInfo)
      .catch(() => setInfo(null))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleDownload = async () => {
    try {
      const filename = `skillfort-certificate-${info?.course_title?.replace(/\s+/g, "-") || courseId}.pdf`;
      await downloadCertificatePdf(courseId, filename);
    } catch {
      alert("Failed to download certificate. Please try again.");
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" /></div>;

  if (!info) return (
    <div className="container-wide py-12 text-center">
      <p className="text-rose-500">Unable to load certificate information.</p>
      <Link to="/my-courses" className="mt-4 inline-block text-brand-primary hover:underline">Back to My Courses</Link>
    </div>
  );

  const issuedDate = info.issued_date ? new Date(info.issued_date).toLocaleDateString("en-IN", { day:"numeric",month:"long",year:"numeric" }) : new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});

  return (
    <div className="container-wide py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold">Certificate of Completion</h1>
            <p className="mt-1 text-sm text-slate-500">{info.course_title}</p>
          </div>
          <div className="flex gap-3">
            {info.eligible ? (
              <button onClick={handleDownload} className="rounded-xl bg-yellow-400 px-5 py-2 font-semibold text-slate-900 hover:bg-yellow-300 flex items-center gap-2">
                Download PDF
              </button>
            ) : null}
            <Link to="/my-courses" className="rounded-xl border px-5 py-2 font-semibold text-sm hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">Back to Courses</Link>
          </div>
        </div>

        {!info.eligible ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800/30 dark:bg-amber-900/10">
            <p className="text-4xl mb-4">\U0001f512</p>
            <h2 className="text-xl font-bold">Certificate Locked</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Complete all lessons to unlock your certificate.</p>
            <div className="mt-4 mx-auto max-w-xs">
              <div className="h-3 rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-3 rounded-full bg-brand-primary transition-all" style={{ width: `${info.progress_percent}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold">{info.progress_percent}% complete</p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div className="relative bg-slate-900 p-10 text-center" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
              <div className="absolute inset-3 rounded-xl border-2 border-yellow-400/60 pointer-events-none" />
              <div className="absolute inset-4 rounded-xl border border-yellow-400/30 pointer-events-none" />

              <div className="relative">
                <p className="text-yellow-400 font-heading text-2xl font-bold tracking-widest">SKILLFORT INSTITUTE</p>
                <p className="mt-1 text-slate-400 text-xs tracking-wider">Professional Development &amp; Placement Training</p>

                <div className="my-6 border-t border-yellow-400/30" />

                <p className="text-slate-300 text-sm tracking-widest uppercase">Certificate of Completion</p>

                <p className="mt-6 text-slate-400 text-sm">This is to certify that</p>
                <p className="mt-3 font-heading text-4xl font-bold text-white">{info.student_name}</p>
                <p className="mt-3 text-slate-400 text-sm">has successfully completed the course</p>
                <p className="mt-3 font-heading text-2xl font-bold text-yellow-400">{info.course_title}</p>
                <span className="mt-2 inline-block rounded-full bg-yellow-400/10 px-3 py-1 text-xs text-yellow-400 ring-1 ring-yellow-400/30">{info.course_category}</span>

                <div className="my-8 border-t border-yellow-400/20" />

                <div className="flex items-end justify-between px-8">
                  <div className="text-left">
                    <p className="text-xs text-slate-500">Certificate No.</p>
                    <p className="text-sm font-mono font-bold text-slate-300">{info.certificate_no}</p>
                    <p className="mt-2 text-xs text-slate-500">Issue Date</p>
                    <p className="text-sm text-slate-300">{issuedDate}</p>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 border-t border-yellow-400/50 w-40" />
                    <p className="text-xs text-slate-400">Authorized Signatory</p>
                    <p className="text-xs text-slate-500">Skillfort Institute</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-2">
                  <span className="text-yellow-400 text-2xl">\u2726</span>
                  <span className="text-yellow-400/50 text-2xl">\u2726</span>
                  <span className="text-yellow-400/30 text-2xl">\u2726</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {info.eligible && (
          <div className="mt-6 rounded-2xl border p-5 dark:border-white/10">
            <h3 className="font-semibold mb-3">Certificate Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-500">Student Name</p><p className="font-medium">{info.student_name}</p></div>
              <div><p className="text-slate-500">Course</p><p className="font-medium">{info.course_title}</p></div>
              <div><p className="text-slate-500">Certificate No.</p><p className="font-mono text-xs font-medium">{info.certificate_no}</p></div>
              <div><p className="text-slate-500">Issue Date</p><p className="font-medium">{issuedDate}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
