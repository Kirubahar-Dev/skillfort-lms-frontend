import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AnimatedPage } from "../../components/common/AnimatedPage";
import { PageHero } from "../../components/common/PageHero";
import { CourseCard } from "../../components/course/CourseCard";
import { SectionBlock } from "../../components/ui/SectionBlock";
import { useLmsStore } from "../../context/LmsStore";
import { blogPosts, placements, successStories } from "../../data/mockData";
import { formatInr } from "../../lib/format";

export function HomePage() {
  const { courseCatalog } = useLmsStore();

  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-3xl border bg-white/75 p-6 shadow-soft md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="kicker">Skillfort Institute</p>
            <h1 className="hero-title mt-3">Recorded Career Courses + LMS + Placement Workflow</h1>
            <p className="mt-4 max-w-2xl text-base text-sf-muted">
              Multi-page frontend for students, instructors, and Skillfort admin. Browse and purchase recorded courses,
              learn inside a structured LMS player, and manage operations with role-based panels.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/courses" className="btn-primary">
                Explore Courses
              </Link>
              <Link to="/cart" className="btn-secondary">
                View Cart Flow
              </Link>
              <Link to="/student/dashboard" className="btn-secondary">
                Open Student Dashboard
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border bg-sf-cream p-4">
            <img src="/skillfort-logo-full.jpg" alt="Skillfort" className="h-56 w-full rounded-xl object-cover" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <article className="rounded-xl border bg-white p-3">
                <p className="text-sf-muted">Active Learners</p>
                <p className="mt-1 text-lg font-semibold">4,200+</p>
              </article>
              <article className="rounded-xl border bg-white p-3">
                <p className="text-sf-muted">Recorded Library</p>
                <p className="mt-1 text-lg font-semibold">380+ hours</p>
              </article>
              <article className="rounded-xl border bg-white p-3">
                <p className="text-sf-muted">Placement Partners</p>
                <p className="mt-1 text-lg font-semibold">120+</p>
              </article>
              <article className="rounded-xl border bg-white p-3">
                <p className="text-sf-muted">Avg Rating</p>
                <p className="mt-1 text-lg font-semibold">4.8/5</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <SectionBlock
        title="Featured Programs"
        description="Career tracks designed for recorded learning + mentor checkpoints."
        action={
          <Link to="/courses" className="btn-secondary">
            View all tracks
          </Link>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courseCatalog.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Placement Stories" description="Recent hiring outcomes from Skillfort cohorts.">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {successStories.map((item) => (
            <article key={`${item.name}-${item.company}`} className="rounded-xl border bg-white p-4">
              <p className="text-sm text-sf-muted">{item.company}</p>
              <p className="mt-1 font-semibold">{item.name}</p>
              <p className="text-sm text-sf-muted">{item.role}</p>
            </article>
          ))}
        </div>
      </SectionBlock>
    </AnimatedPage>
  );
}

export function CoursesPage() {
  const { courseCatalog } = useLmsStore();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");

  const filtered = useMemo(() => {
    return courseCatalog.filter((course) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.summary.toLowerCase().includes(q);
      const matchesLevel = level === "All" || course.level === level;
      return matchesQuery && matchesLevel;
    });
  }, [courseCatalog, query, level]);

  return (
    <AnimatedPage>
      <PageHero
        kicker="Course Catalog"
        title="Recorded Programs with Purchase + LMS Access"
        description="Add courses to cart, apply coupons, checkout, and continue inside the learner dashboard."
      />

      <section className="panel">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <label className="label-base">
            Search
            <input
              className="input-base mt-1"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by track, skill, or keyword"
            />
          </label>
          <label className="label-base">
            Level
            <select className="input-base mt-1" value={level} onChange={(event) => setLevel(event.target.value)}>
              <option>All</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
    </AnimatedPage>
  );
}

export function CourseDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { courseCatalog, addToCart } = useLmsStore();
  const course = courseCatalog.find((item) => item.slug === params.slug);

  if (!course) {
    return (
      <AnimatedPage>
        <PageHero
          kicker="Course"
          title="Course not found"
          description="The requested course does not exist. Please return to the catalog."
          actions={
            <Link to="/courses" className="btn-primary">
              Back to courses
            </Link>
          }
        />
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <section className="panel-soft">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="kicker">{course.category}</p>
            <h1 className="hero-title mt-2">{course.title}</h1>
            <p className="mt-3 text-sm text-sf-muted md:text-base">{course.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-sf-muted">
              {course.tags.map((tag) => (
                <span key={tag} className="rounded-full border px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <aside className="rounded-2xl border bg-white p-4 shadow-soft">
            <img src={course.thumbnail} alt={course.title} className="h-44 w-full rounded-xl object-cover" />
            <p className="mt-4 text-2xl font-semibold">{formatInr(course.price)}</p>
            {course.oldPrice ? <p className="text-sm text-sf-muted line-through">{formatInr(course.oldPrice)}</p> : null}
            <p className="mt-2 text-sm text-sf-muted">Recorded sessions + mentor support + certificate.</p>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                className="btn-primary w-full"
                onClick={() => {
                  addToCart(course);
                  navigate("/cart");
                }}
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="btn-secondary w-full"
                onClick={() => {
                  addToCart(course);
                  navigate("/checkout");
                }}
              >
                Buy Now
              </button>
            </div>
          </aside>
        </div>
      </section>

      <SectionBlock title="What you will learn" description="Module-wise recorded learning plan.">
        <div className="space-y-3">
          {course.modules.map((module) => (
            <article key={module.id} className="rounded-xl border bg-white p-4">
              <p className="font-semibold">{module.title}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-sf-muted">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    {lesson.title} ({lesson.kind} - {lesson.duration})
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SectionBlock>
    </AnimatedPage>
  );
}

export function AboutPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="About Skillfort"
        title="Software training + LMS delivery + placement focus"
        description="We design practical career tracks with recorded content, mentor checkpoints, and assessment-backed progress."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel">
          <h2 className="section-title">Vision</h2>
          <p className="mt-3 text-sm text-sf-muted">
            Build India&apos;s most trusted practical-learning institute where learners move from concept clarity to offer
            letters through structured outcomes.
          </p>
        </article>
        <article className="panel">
          <h2 className="section-title">Mission</h2>
          <p className="mt-3 text-sm text-sf-muted">
            Deliver role-based upskilling that combines recorded sessions, project mentoring, assessments, and career
            support workflows.
          </p>
        </article>
      </section>
    </AnimatedPage>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AnimatedPage>
      <PageHero
        kicker="Contact"
        title="Talk to Skillfort Admissions"
        description="Share your goals and we will suggest the right recorded program with timeline and pricing."
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <form className="panel space-y-3" onSubmit={onSubmit}>
          <label className="label-base">
            Full Name
            <input className="input-base mt-1" required placeholder="Your full name" />
          </label>
          <label className="label-base">
            Email
            <input className="input-base mt-1" required type="email" placeholder="name@email.com" />
          </label>
          <label className="label-base">
            Phone
            <input className="input-base mt-1" required type="tel" placeholder="+91" />
          </label>
          <label className="label-base">
            Message
            <textarea className="input-base mt-1 min-h-28" placeholder="Tell us your career target" />
          </label>
          <button type="submit" className="btn-primary">
            Send enquiry
          </button>
          {sent ? <p className="text-sm font-medium text-emerald-700">Thanks. We will contact you shortly.</p> : null}
        </form>

        <aside className="panel space-y-3">
          <p className="text-sm text-sf-muted">Address</p>
          <p className="font-semibold">1st Floor, Rajiv Gandhi Salai, Navalur, Chennai</p>
          <p className="text-sm text-sf-muted">Phone: +91 93449 93939</p>
          <p className="text-sm text-sf-muted">Email: info@skillfortinstitute.com</p>
          <p className="text-sm text-sf-muted">Hours: Mon-Sat 10:00 AM to 6:30 PM</p>
        </aside>
      </section>
    </AnimatedPage>
  );
}

export function BlogPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Blog"
        title="Career and LMS Insights"
        description="Short reads from Skillfort mentors on interview prep, projects, and learning strategy."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {blogPosts.map((post) => (
          <article key={post.id} className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sf-goldStrong">{post.date}</p>
            <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-sf-muted">{post.excerpt}</p>
            <p className="mt-3 text-xs text-sf-muted">By {post.author}</p>
          </article>
        ))}
      </section>
    </AnimatedPage>
  );
}

export function PlacementsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Placement"
        title="Success stories from Skillfort learners"
        description="Learners transition from training to interviews using role tracks, projects, and mock rounds."
      />

      <SectionBlock title="Hiring Partners" description="Companies that regularly evaluate Skillfort learners.">
        <div className="flex flex-wrap gap-2">
          {placements.map((company) => (
            <span key={company} className="rounded-full border bg-white px-3 py-2 text-sm text-sf-muted">
              {company}
            </span>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Recent Outcomes">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {successStories.map((item) => (
            <article key={item.name} className="rounded-xl border bg-white p-4">
              <p className="text-sm text-sf-muted">{item.company}</p>
              <p className="mt-1 font-semibold">{item.name}</p>
              <p className="text-sm text-sf-muted">{item.role}</p>
            </article>
          ))}
        </div>
      </SectionBlock>
    </AnimatedPage>
  );
}
