import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AnimatedPage } from "../../components/common/AnimatedPage";
import { PageHero } from "../../components/common/PageHero";
import { MetricPanel } from "../../components/dashboard/MetricPanel";
import { SectionBlock } from "../../components/ui/SectionBlock";
import { useLmsStore } from "../../context/LmsStore";
import { formatInr } from "../../lib/format";

interface BuilderModule {
  id: string;
  title: string;
  lessons: string[];
}

export function InstructorDashboardPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Instructor Dashboard"
        title="Overview of courses, learners, and earnings"
        description="Manage your published tracks, learner engagement, and payouts from one workspace."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricPanel label="Active Courses" value="8" hint="3 under review" />
        <MetricPanel label="Total Students" value="1,284" hint="Across all batches" />
        <MetricPanel label="Monthly Earnings" value={formatInr(286000)} hint="After platform fee" />
        <MetricPanel label="Avg Rating" value="4.8" hint="From learner reviews" />
      </section>

      <SectionBlock title="Quick Management">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["My Courses", "/instructor/courses"],
            ["Create Course", "/instructor/courses/create"],
            ["Course Builder", "/instructor/course-builder/python-full-stack"],
            ["Analytics", "/instructor/analytics"],
            ["Students", "/instructor/students"],
            ["Earnings", "/instructor/earnings"],
          ].map(([label, to]) => (
            <Link key={to} to={to} className="rounded-xl border bg-white px-4 py-3 font-medium text-sf-muted hover:bg-sf-cream">
              {label}
            </Link>
          ))}
        </div>
      </SectionBlock>
    </AnimatedPage>
  );
}

export function InstructorAnalyticsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Analytics"
        title="Course performance analytics"
        description="Track completion rates, watch-time patterns, and learner outcomes."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel">
          <h2 className="section-title">Completion Funnel</h2>
          <p className="mt-3 text-sm text-sf-muted">Visited course page: 12,430</p>
          <p className="text-sm text-sf-muted">Started lessons: 5,320</p>
          <p className="text-sm text-sf-muted">Completed track: 2,610</p>
        </article>
        <article className="panel">
          <h2 className="section-title">Engagement by module</h2>
          <p className="mt-3 text-sm text-sf-muted">Highest drop-off seen in Module 3 practical assignment.</p>
          <p className="text-sm text-sf-muted">Recommendation: add short recap lesson and hint sheet.</p>
        </article>
      </section>
    </AnimatedPage>
  );
}

export function InstructorCoursesPage() {
  const { courseCatalog } = useLmsStore();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Course Management"
        title="My Courses"
        description="Manage created and published learning tracks."
        actions={
          <Link to="/instructor/courses/create" className="btn-primary">
            Create New Course
          </Link>
        }
      />

      <section className="panel overflow-auto">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-sf-cream text-left">
            <tr>
              <th className="px-3 py-2">Course</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {courseCatalog.map((course) => (
              <tr key={course.id}>
                <td className="px-3 py-2 font-medium">{course.title}</td>
                <td className="px-3 py-2 text-sf-muted">{course.category}</td>
                <td className="px-3 py-2">{formatInr(course.price)}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Link className="btn-secondary" to={`/instructor/courses/${course.slug}/edit`}>
                      Edit
                    </Link>
                    <Link className="btn-secondary" to={`/instructor/course-builder/${course.slug}`}>
                      Builder
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AnimatedPage>
  );
}

export function CreateCoursePage() {
  const [saved, setSaved] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <AnimatedPage>
      <PageHero kicker="Course Creation" title="Create course" description="Define core metadata and pricing before building modules." />

      <form className="panel grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        <label className="label-base">
          Course Title
          <input className="input-base mt-1" required placeholder="Course title" />
        </label>
        <label className="label-base">
          Category
          <input className="input-base mt-1" required placeholder="Full Stack / Analytics" />
        </label>
        <label className="label-base">
          Price (INR)
          <input className="input-base mt-1" required type="number" min={0} />
        </label>
        <label className="label-base">
          Skill Level
          <select className="input-base mt-1" defaultValue="Beginner">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label className="label-base md:col-span-2">
          Description
          <textarea className="input-base mt-1 min-h-28" />
        </label>
        <button className="btn-primary md:col-span-2" type="submit">
          Save Draft
        </button>
        {saved ? <p className="text-sm text-emerald-700 md:col-span-2">Draft saved successfully.</p> : null}
      </form>
    </AnimatedPage>
  );
}

export function EditCoursePage() {
  const { slug } = useParams();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Edit Course"
        title={`Edit ${slug}`}
        description="Update description, pricing, and publishing metadata."
      />
      <section className="panel text-sm text-sf-muted">
        This page can connect to backend course update APIs. Current scaffold includes editable form patterns.
      </section>
    </AnimatedPage>
  );
}

export function CourseBuilderPage() {
  const { slug } = useParams();
  const [moduleInput, setModuleInput] = useState("");
  const [lessonInput, setLessonInput] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("module-1");
  const [modules, setModules] = useState<BuilderModule[]>([
    { id: "module-1", title: "Module 1 - Foundations", lessons: ["Project setup", "Core syntax", "Hands-on task"] },
    { id: "module-2", title: "Module 2 - Build Sprint", lessons: ["API design", "Database integration"] },
  ]);
  const [publishStage, setPublishStage] = useState("Draft");

  const addModule = () => {
    const title = moduleInput.trim();
    if (!title) {
      return;
    }

    const id = `module-${Date.now()}`;
    setModules((existing) => [...existing, { id, title, lessons: [] }]);
    setModuleInput("");
    setSelectedModuleId(id);
  };

  const addLesson = () => {
    const title = lessonInput.trim();
    if (!title) {
      return;
    }

    setModules((existing) =>
      existing.map((module) =>
        module.id === selectedModuleId ? { ...module, lessons: [...module.lessons, title] } : module,
      ),
    );
    setLessonInput("");
  };

  const activeModule = modules.find((module) => module.id === selectedModuleId);

  return (
    <AnimatedPage>
      <PageHero
        kicker="Course Builder"
        title={`Build curriculum: ${slug}`}
        description="Core builder page for module planning, lesson composition, and publish workflow."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="panel space-y-3">
          <h2 className="section-title">Publish Settings</h2>
          <div className="flex flex-wrap gap-2">
            {["Draft", "Review", "Published"].map((stage) => (
              <button
                key={stage}
                type="button"
                className={publishStage === stage ? "btn-primary" : "btn-secondary"}
                onClick={() => setPublishStage(stage)}
              >
                {stage}
              </button>
            ))}
          </div>
          <p className="text-sm text-sf-muted">Current stage: {publishStage}</p>
        </article>

        <article className="panel space-y-3">
          <h2 className="section-title">Add Module</h2>
          <input
            className="input-base"
            value={moduleInput}
            onChange={(event) => setModuleInput(event.target.value)}
            placeholder="Module title"
          />
          <button type="button" className="btn-primary" onClick={addModule}>
            Add Module
          </button>
        </article>

        <article className="panel space-y-3">
          <h2 className="section-title">Modules</h2>
          <div className="space-y-2">
            {modules.map((module) => (
              <button
                key={module.id}
                type="button"
                onClick={() => setSelectedModuleId(module.id)}
                className={`block w-full rounded-xl border px-3 py-2 text-left ${selectedModuleId === module.id ? "bg-sf-cream" : "bg-white"}`}
              >
                <p className="font-medium">{module.title}</p>
                <p className="text-xs text-sf-muted">{module.lessons.length} lessons</p>
              </button>
            ))}
          </div>
        </article>

        <article className="panel space-y-3">
          <h2 className="section-title">Lessons</h2>
          <input
            className="input-base"
            value={lessonInput}
            onChange={(event) => setLessonInput(event.target.value)}
            placeholder="Lesson title"
          />
          <button type="button" className="btn-secondary" onClick={addLesson}>
            Add Lesson
          </button>
          <div className="rounded-xl border bg-white p-3 text-sm text-sf-muted">
            {(activeModule?.lessons ?? []).map((lesson) => (
              <p key={lesson} className="py-1">• {lesson}</p>
            ))}
          </div>
        </article>
      </section>
    </AnimatedPage>
  );
}

export function CreateQuizPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Assessment Management"
        title="Create quiz"
        description="Set title, time limit, and pass score for course assessments."
      />
      <section className="panel grid gap-3 md:grid-cols-2">
        <label className="label-base">
          Quiz Title
          <input className="input-base mt-1" placeholder="Module 2 Assessment" />
        </label>
        <label className="label-base">
          Time Limit (minutes)
          <input className="input-base mt-1" type="number" defaultValue={15} />
        </label>
        <label className="label-base">
          Pass Score (%)
          <input className="input-base mt-1" type="number" defaultValue={70} />
        </label>
        <button type="button" className="btn-primary md:col-span-2">
          Save Quiz Draft
        </button>
      </section>
    </AnimatedPage>
  );
}

export function AddQuestionsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Assessment Management"
        title="Add questions"
        description="Build question bank with options, correct answers, and tagging."
      />
      <section className="panel space-y-3">
        <label className="label-base">
          Question
          <textarea className="input-base mt-1 min-h-20" />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          {["Option A", "Option B", "Option C", "Option D"].map((label) => (
            <label key={label} className="label-base">
              {label}
              <input className="input-base mt-1" />
            </label>
          ))}
        </div>
        <button type="button" className="btn-primary">
          Add Question
        </button>
      </section>
    </AnimatedPage>
  );
}

export function AssignmentCreationPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Assessment Management"
        title="Create assignment"
        description="Define assignment brief, rubric, and submission format."
      />
      <section className="panel grid gap-3">
        <label className="label-base">
          Assignment Title
          <input className="input-base mt-1" />
        </label>
        <label className="label-base">
          Instructions
          <textarea className="input-base mt-1 min-h-24" />
        </label>
        <button type="button" className="btn-primary">
          Publish Assignment
        </button>
      </section>
    </AnimatedPage>
  );
}

export function EvaluationPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Evaluation"
        title="Assignment grading"
        description="Review submissions, score against rubric, and share feedback."
      />
      <section className="panel overflow-auto">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-sf-cream text-left">
            <tr>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Assignment</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {[
              ["Surya", "API Capstone", "Submitted"],
              ["Priya", "Dashboard build", "Under review"],
              ["Arun", "Testing sprint", "Submitted"],
            ].map(([student, assignment, status]) => (
              <tr key={student as string}>
                <td className="px-3 py-2">{student as string}</td>
                <td className="px-3 py-2">{assignment as string}</td>
                <td className="px-3 py-2 text-sf-muted">{status as string}</td>
                <td className="px-3 py-2">
                  <button type="button" className="btn-secondary">Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AnimatedPage>
  );
}

export function InstructorStudentsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Student Management"
        title="Enrolled students"
        description="View student list, activity level, and course progress breakdown."
      />

      <section className="panel overflow-auto">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-sf-cream text-left">
            <tr>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Track</th>
              <th className="px-3 py-2">Progress</th>
              <th className="px-3 py-2">View</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {[
              ["Surya", "Python Full Stack", "72%", "1001"],
              ["Chitra", "Java Full Stack", "58%", "1002"],
              ["Kirubakar", "Data Analytics", "44%", "1003"],
            ].map(([name, track, progress, id]) => (
              <tr key={id as string}>
                <td className="px-3 py-2">{name as string}</td>
                <td className="px-3 py-2">{track as string}</td>
                <td className="px-3 py-2 text-sf-muted">{progress as string}</td>
                <td className="px-3 py-2">
                  <Link className="btn-secondary" to={`/instructor/students/${id}/progress`}>
                    Progress
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AnimatedPage>
  );
}

export function InstructorStudentProgressPage() {
  const { id } = useParams();

  return (
    <AnimatedPage>
      <PageHero
        kicker="Student Progress"
        title={`Learner progress detail: ${id}`}
        description="Detailed module completion, attendance, and assessment trend for instructor review."
      />
      <section className="panel text-sm text-sf-muted">
        This detail page can show per-module video watch percentage and assignment timeline for each learner.
      </section>
    </AnimatedPage>
  );
}

export function EarningsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Earnings"
        title="Earnings dashboard"
        description="Track gross revenue, payout status, and monthly trends."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricPanel label="This Month" value={formatInr(286000)} />
        <MetricPanel label="Pending Payout" value={formatInr(42000)} />
        <MetricPanel label="Refund Impact" value={formatInr(8000)} />
        <MetricPanel label="Lifetime Earnings" value={formatInr(1625000)} />
      </section>
    </AnimatedPage>
  );
}

export function PayoutHistoryPage() {
  return (
    <AnimatedPage>
      <PageHero kicker="Payouts" title="Payout history" description="Review completed and upcoming payouts." />

      <section className="panel overflow-auto">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-sf-cream text-left">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {[
              ["Mar 31, 2026", formatInr(102000), "Paid"],
              ["Feb 29, 2026", formatInr(91000), "Paid"],
              ["Apr 30, 2026", formatInr(42000), "Scheduled"],
            ].map(([date, amount, status]) => (
              <tr key={date as string}>
                <td className="px-3 py-2">{date as string}</td>
                <td className="px-3 py-2">{amount as string}</td>
                <td className="px-3 py-2 text-sf-muted">{status as string}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AnimatedPage>
  );
}

export function InstructorProfileSettingsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Settings"
        title="Instructor profile settings"
        description="Manage your public profile, bio, and support links."
      />
      <section className="panel grid gap-3 md:grid-cols-2">
        <label className="label-base">
          Display Name
          <input className="input-base mt-1" defaultValue="Arjun Prakash" />
        </label>
        <label className="label-base">
          Professional Title
          <input className="input-base mt-1" defaultValue="Senior Full Stack Mentor" />
        </label>
        <label className="label-base md:col-span-2">
          Bio
          <textarea className="input-base mt-1 min-h-24" defaultValue="Trainer with 9+ years of product engineering experience." />
        </label>
        <button type="button" className="btn-primary md:col-span-2">
          Save Settings
        </button>
      </section>
    </AnimatedPage>
  );
}

export function InstructorPaymentDetailsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Settings"
        title="Payout payment details"
        description="Configure account details for instructor payouts."
      />
      <section className="panel grid gap-3 md:grid-cols-2">
        <label className="label-base">
          Account Holder Name
          <input className="input-base mt-1" />
        </label>
        <label className="label-base">
          Bank Name
          <input className="input-base mt-1" />
        </label>
        <label className="label-base">
          Account Number
          <input className="input-base mt-1" />
        </label>
        <label className="label-base">
          IFSC Code
          <input className="input-base mt-1" />
        </label>
        <button type="button" className="btn-primary md:col-span-2">
          Save Payout Settings
        </button>
      </section>
    </AnimatedPage>
  );
}