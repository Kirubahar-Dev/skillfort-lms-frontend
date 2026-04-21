import { useEffect, useState } from "react";
import { fetchStaticPage } from "../../services/pageService";

const team = [
  { name: "Arun Prakash", role: "Full Stack & React Instructor", courses: "Full Stack, React.js" },
  { name: "Priya N", role: "Python & Backend Instructor", courses: "Python Full Stack, FastAPI" },
  { name: "Karthik M", role: "Java & System Design Instructor", courses: "Java Full Stack, DSA" },
  { name: "Meena R", role: "Database & Oracle Instructor", courses: "Oracle SQL/PL-SQL, Cloud SRE" },
  { name: "Surya K", role: "AWS & DevOps Instructor", courses: "AWS Cloud, DevOps Career Path" },
  { name: "Lakshmi V", role: "Data Analytics Instructor", courses: "Data Analyst, HR Prep" },
];

const milestones = [
  { year: "Dec 2024", text: "Skillfort Institute founded in Chennai" },
  { year: "Jan 2025", text: "First batch of 50 students enrolled" },
  { year: "Mar 2025", text: "200+ students placed across IT companies" },
  { year: "Apr 2025", text: "700+ placements, 100+ hiring partners" },
];

export default function AboutPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaticPage("about-us")
      .then((d) => setContent(d.content || ""))
      .catch(() => setContent(
        "SkillFort Software Training & Placements bridges the gap between education and employment " +
        "with practical software training, mentorship, and placement-driven outcomes."
      ))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-none bg-gradient-to-r from-brand-primary to-[#2F2A7A]">
        <div className="container-wide grid items-center gap-8 py-14 lg:grid-cols-2">
          <div className="text-white">
            <p className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
              Est. December 2024 · Chennai, India
            </p>
            <h1 className="font-heading text-4xl font-bold">About SkillFort</h1>
            <p className="mt-3 max-w-xl text-slate-200">
              {loading
                ? "Loading..."
                : content ||
                  "SkillFort Software Training & Placements is Chennai's most trusted placement-focused IT training institute — bridging academics and industry with practical skills."}
            </p>
          </div>
          <img
            src="/images/graduation.png"
            alt="Skillfort graduates celebrating"
            className="hidden w-full rounded-3xl shadow-2xl lg:block"
          />
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="bg-white py-10 dark:bg-white/5">
        <div className="container-wide grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Founded", value: "Dec 2024" },
            { label: "Students Trained", value: "1000+" },
            { label: "Placements", value: "700+" },
            { label: "Hiring Partners", value: "100+" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border p-6 text-center dark:border-white/10">
              <p className="font-heading text-3xl font-bold text-brand-primary">{value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────────────── */}
      <section className="container-wide py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="grid gap-5">
            <article className="rounded-2xl border bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="font-heading text-2xl font-bold">Our Mission</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Provide affordable, practical, and industry-relevant training. Equip learners with skills
                that match current IT job roles and support students from learning to placement with
                continuous mentorship.
              </p>
            </article>
            <article className="rounded-2xl border bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="font-heading text-2xl font-bold">Our Vision</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                To become India's most trusted and result-oriented training and placement institute,
                empowering thousands of learners to build successful IT careers and become the top 1%
                of industry innovators.
              </p>
            </article>
          </div>
          <img
            src="/images/career-hero.png"
            alt="Career transformation"
            className="w-full rounded-3xl shadow-xl"
          />
        </div>
      </section>

      {/* ── What We Offer ────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-14 dark:bg-white/5">
        <div className="container-wide">
          <h2 className="section-title text-center">What's Included in Every Course</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["🎥", "Live Interactive Sessions", "Real-time classes with doubt clearing and lifetime recording access"],
              ["💼", "Real-World Projects", "Hands-on projects with practical implementation"],
              ["📝", "Interview Prep", "Interview cheat sheet, Q&A sessions, and mock panel interviews"],
              ["🏅", "3 Certificates", "Training, Internship & Excellence Performance certificates"],
              ["📚", "LMS Access", "Recorded sessions and study materials valid for 6 months"],
              ["🤝", "Placement Support", "Dedicated placement cell, resume building, and hiring network"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-2xl">{icon}</p>
                <p className="mt-2 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructors ──────────────────────────────────────────────── */}
      <section className="container-wide py-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="section-title">Our Expert Instructors</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Led by experienced IT professionals and real-time trainers with industry expertise.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {team.map(({ name, role, courses }) => (
                <div key={name} className="rounded-2xl border p-5 dark:border-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-slate-900">
                    {name.charAt(0)}
                  </div>
                  <p className="mt-3 font-semibold">{name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
                  <p className="mt-1 text-xs text-brand-primary">{courses}</p>
                </div>
              ))}
            </div>
          </div>
          <img
            src="/images/student-learning.png"
            alt="Student studying"
            className="sticky top-24 hidden w-full rounded-3xl shadow-lg lg:block"
          />
        </div>
      </section>

      {/* ── Journey Timeline ─────────────────────────────────────────── */}
      <section className="bg-[#0f0f1a] py-14 text-white">
        <div className="container-wide">
          <h2 className="font-heading text-3xl font-bold">Our Journey</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map(({ year, text }) => (
              <div key={year} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-heading text-xl font-bold text-brand-primary">{year}</p>
                <p className="mt-2 text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────────── */}
      <section className="container-wide py-14">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-brand-primary p-10 text-center text-slate-900">
          <img src="/images/world-map.png" alt="" className="absolute opacity-5 pointer-events-none hidden lg:block w-full max-w-2xl" />
          <h2 className="font-heading text-3xl font-bold">Ready to Join Skillfort?</h2>
          <p className="max-w-xl text-slate-200">
            Talk to our team and get started with the right program for your career goals.
          </p>
          <div className="flex gap-3">
            <a href="mailto:HumanResources@skillfortinstitute.com" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-primary">
              Email Us
            </a>
            <a href="tel:+919344993939" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold">
              +91 93449 93939
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
