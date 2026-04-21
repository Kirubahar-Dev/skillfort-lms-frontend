import { useParams } from "react-router-dom";

function safe(text) {
  return text?.trim() ? text : null;
}

export default function InstructorDetailPage() {
  const { id, slug } = useParams();
  const bio = safe("Senior software trainer with 10+ years experience.");
  const exp = safe("");
  const education = safe("M.Tech Computer Science");

  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Instructor #{id} - {slug?.replaceAll("-", " ")}</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          {bio ? <article className="rounded-xl border p-4 dark:border-white/10"><h2 className="font-semibold">Bio</h2><p className="mt-2 text-slate-600 dark:text-slate-300">{bio}</p></article> : null}
          {exp ? <article className="rounded-xl border p-4 dark:border-white/10"><h2 className="font-semibold">Experience</h2><p className="mt-2 text-slate-600 dark:text-slate-300">{exp}</p></article> : <article className="rounded-xl border p-4 dark:border-white/10 text-sm text-slate-500">Experience details will be added soon.</article>}
          {education ? <article className="rounded-xl border p-4 dark:border-white/10"><h2 className="font-semibold">Education</h2><p className="mt-2 text-slate-600 dark:text-slate-300">{education}</p></article> : null}
        </section>
        <aside className="rounded-xl border p-4 dark:border-white/10">
          <h2 className="font-semibold">Quick Contact</h2>
          <form className="mt-3 space-y-2">
            <input className="w-full rounded-lg border p-2 bg-transparent" placeholder="Name" />
            <input className="w-full rounded-lg border p-2 bg-transparent" placeholder="Email" />
            <textarea className="w-full rounded-lg border p-2 bg-transparent" rows="4" placeholder="Message" />
            <button className="w-full rounded-lg bg-brand-primary py-2 text-slate-900">Send</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
