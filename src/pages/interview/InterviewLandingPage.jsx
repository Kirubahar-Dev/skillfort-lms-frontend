import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const cards = [
  { title: "Data Structures & Algorithms", color: "#6C63FF", count: 180, slug: "dsa" },
  { title: "System Design", color: "#0F6E56", count: 64, slug: "system-design" },
  { title: "Python / Java / SQL", color: "#854F0B", count: 120, slug: "languages" },
  { title: "Full Stack Web Development", color: "#185FA5", count: 102, slug: "full-stack" },
  { title: "Cloud & DevOps", color: "#993C1D", count: 55, slug: "cloud-devops" },
  { title: "HR & Behavioural", color: "#993556", count: 80, slug: "hr" },
];

export default function InterviewLandingPage() {
  return (
    <div className="bg-[#0F0F1A] text-white">
      <section className="hero-gradient relative overflow-hidden py-20">
        <div className="container-wide relative">
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-5xl font-extrabold md:text-6xl">
            Crack Your Dream Job Interview
          </motion.h1>
          <p className="mt-4 max-w-3xl text-slate-300">Curated questions, live compiler, and structured roadmaps - all free.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/interview-prep/questions" className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold">Browse Questions</Link>
            <Link to="/interview-prep/compiler" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold">Open Compiler</Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["500+ Questions", "6 Domains", "Live Compiler", "Free Forever"].map((x) => <div key={x} className="glass-panel p-4">{x}</div>)}
          </div>
        </div>
      </section>

      <section className="container-wide py-16">
        <h2 className="font-heading text-3xl font-bold">Explore Domains</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:-translate-y-1"
              style={{ borderTop: `3px solid ${card.color}` }}
            >
              <h3 className="font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{card.count}+ questions</p>
              <Link to={`/interview-prep/topics/${card.slug}`} className="mt-4 inline-block text-sm text-brand-primary">Open Topic</Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-wide pb-16">
        <h2 className="font-heading text-3xl">Interview Readiness Roadmap</h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {["Core DSA", "Language Proficiency", "System Design", "Mock Tests", "HR Rounds", "Placement"].map((step, idx) => (
            <li key={step} className="rounded-xl border border-white/10 bg-white/5 p-4">Step {idx + 1}: {step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
