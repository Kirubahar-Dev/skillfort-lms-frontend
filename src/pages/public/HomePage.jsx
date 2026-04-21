import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CourseCard from "../../components/ui/CourseCard";
import { fallbackCourses } from "../../utils/mockData";

const categories = [
  ["Data Structures & Algorithms", "#6C63FF", 180],
  ["System Design", "#0F6E56", 64],
  ["Python / Java / SQL", "#854F0B", 120],
  ["Full Stack Development", "#185FA5", 102],
  ["Cloud & DevOps", "#993C1D", 55],
  ["HR & Behavioural", "#993556", 80],
];

const stats = [
  { label: "Students Trained", value: "1000+" },
  { label: "Placements", value: "700+" },
  { label: "Hiring Companies", value: "100+" },
  { label: "Courses", value: "18+" },
];

const whyCards = [
  {
    icon: "🎓",
    title: "Placement-First Training",
    desc: "Every program is designed around real hiring requirements with dedicated placement cell support.",
  },
  {
    icon: "🧑‍💻",
    title: "Live Interactive Sessions",
    desc: "Real-time classes with industry trainers, doubt clearing, and lifetime recording access.",
  },
  {
    icon: "📁",
    title: "Real-World Projects",
    desc: "Build portfolio projects and get an internship certificate upon successful completion.",
  },
  {
    icon: "📝",
    title: "Interview Ready",
    desc: "Interview cheat sheets, mock rounds, HR prep, and 500+ curated Q&A questions.",
  },
  {
    icon: "💰",
    title: "Affordable Pricing",
    desc: "Full course from ₹25,000+GST. Student ID discount available. LMS-only from ₹4,999.",
  },
  {
    icon: "🏆",
    title: "Triple Certificate",
    desc: "Training Certificate, Internship Certificate, and Excellence Performance Certificate.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="grid-noise absolute inset-0 opacity-25" />
        <div className="container-wide relative grid min-h-[78vh] items-center gap-8 py-14 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="mb-3 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
              Skillfort Institute LMS
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-6xl">
              Build Skills.<br />Crack Interviews.<br />Get Placed.
            </h1>
            <p className="mt-4 max-w-xl text-slate-200">
              Software training and placement-focused learning from Chennai. Curated coursework, interview prep,
              and live coding — all in one place. 700+ successful placements across MNCs and startups.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses" className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold">
                Explore Courses
              </Link>
              <Link to="/interview-prep" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold">
                Start Preparing
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="/images/graduation.png"
              alt="Skillfort students graduating"
              className="h-[420px] w-full rounded-3xl object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className="border-b border-t bg-white py-6 dark:border-white/10 dark:bg-white/5">
        <div className="container-wide grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-heading text-3xl font-extrabold text-brand-primary">{value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────── */}
      <section className="container-wide py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">About SkillFort</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Founded in <strong>December 2024</strong>, SkillFort Software Training &amp; Placements is
              Chennai's most trusted placement-focused institute. We bridge the gap between academic
              learning and real-time industry requirements.
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Our programs are led by experienced IT professionals and real-time trainers.
              We've supported <strong>700+ successful placements</strong> across IT companies,
              startups, and MNCs — all within a short span.
            </p>
            <div className="mt-6 flex gap-4">
              <Link to="/about-us" className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-slate-900">
                Learn More
              </Link>
              <Link to="/contact" className="rounded-xl border px-5 py-2.5 text-sm font-semibold dark:border-white/20">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/student-learning.png"
              alt="Student learning at Skillfort"
              className="w-full rounded-3xl object-cover shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 hidden rounded-2xl bg-brand-primary px-5 py-3 text-slate-900 shadow-lg lg:block">
              <p className="text-sm font-semibold">📍 Chennai, India</p>
              <p className="text-xs opacity-80">+91 93449 93939</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Courses ───────────────────────────────────────── */}
      <section className="bg-slate-50 py-16 dark:bg-white/5">
        <div className="container-wide">
          <div className="flex items-end justify-between">
            <h2 className="section-title">Popular Courses</h2>
            <Link to="/courses" className="text-sm font-semibold text-brand-primary">
              See All →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {fallbackCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Skillfort ──────────────────────────────────── */}
      <section className="container-wide py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <img
              src="/images/career-hero.png"
              alt="Career transformation with Skillfort"
              className="w-full rounded-3xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="section-title">Why Choose Skillfort?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              We don't just teach — we guide, mentor, and prepare you to become a confident IT professional.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {whyCards.map(({ icon, title, desc }) => (
                <div key={title} className="rounded-2xl border p-4 dark:border-white/10">
                  <p className="text-2xl">{icon}</p>
                  <p className="mt-2 font-semibold">{title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interview Prep Hub ───────────────────────────────────── */}
      <section className="container-wide py-16">
        <div className="grid items-center gap-10 rounded-3xl bg-[#0f0f1a] p-8 text-white lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="font-heading text-3xl font-bold">Interview Prep Hub</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              500+ curated interview questions, topic roadmaps, mock rounds, and live code compiler.
              Covers DSA, System Design, Python, Java, SQL, Cloud, and HR — all free and public.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([title, color, count], idx) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  style={{ borderTop: `3px solid ${color}` }}
                >
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="mt-1 text-xs text-slate-300">{count}+ questions</p>
                </motion.div>
              ))}
            </div>
            <Link
              to="/interview-prep"
              className="mt-8 inline-block rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold"
            >
              Start Preparing →
            </Link>
          </div>
          <img
            src="/images/interview-prep.png"
            alt="Interview preparation"
            className="hidden w-full rounded-2xl object-cover shadow-lg lg:block"
            style={{ maxHeight: 320 }}
          />
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-brand-primary py-16 text-slate-900">
        <div className="container-wide grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold">Ready to Start Your IT Career?</h2>
            <p className="mt-3 text-slate-200">
              Join 1000+ students who chose Skillfort. Get placement support, live mentorship,
              and job-ready skills in 3–6 months.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/register" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-primary">
                Enroll Now
              </Link>
              <a
                href="tel:+919344993939"
                className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold"
              >
                Call Us: +91 93449 93939
              </a>
            </div>
          </div>
          <img
            src="/images/graduation.png"
            alt="Skillfort graduates"
            className="hidden w-full max-w-sm justify-self-end rounded-3xl shadow-2xl lg:block"
          />
        </div>
      </section>
    </div>
  );
}
