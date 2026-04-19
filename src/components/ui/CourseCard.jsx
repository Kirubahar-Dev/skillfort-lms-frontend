import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5">
      <div className="h-44 w-full overflow-hidden">
        <img
          src={course.thumbnail || "/images/student-learning.png"}
          alt={course.title}
          className="h-full w-full object-cover"
          onError={(e) => { e.target.src = "/images/student-learning.png"; }}
        />
      </div>
      <div className="space-y-2 p-4">
        <span className="inline-block rounded-full bg-brand-primary/10 px-2 py-1 text-xs font-semibold text-brand-primary">{course.category}</span>
        <h3 className="line-clamp-2 text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-slate-500">by {course.instructor}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-brand-primary">₹{Number(course.discountPrice).toLocaleString("en-IN")}</span>
          {course.price > course.discountPrice ? (
            <span className="text-sm text-slate-400 line-through">₹{Number(course.price).toLocaleString("en-IN")}</span>
          ) : null}
        </div>
        <Link to={`/course/${course.slug}`} className="block rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
          View Course
        </Link>
      </div>
    </article>
  );
}
