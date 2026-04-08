import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useLmsStore } from "../../context/LmsStore";
import { formatInr } from "../../lib/format";
import { Course } from "../../types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { addToCart, wishlistIds, toggleWishlist } = useLmsStore();
  const inWishlist = wishlistIds.includes(course.id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border bg-white p-4 shadow-soft"
    >
      <img src={course.thumbnail} alt={course.title} className="h-40 w-full rounded-xl object-cover" />
      <div className="mt-3">
        <p className="kicker">{course.category}</p>
        <h3 className="mt-2 font-display text-xl font-semibold">{course.title}</h3>
        <p className="mt-2 text-sm text-sf-muted">{course.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-sf-muted">
          <span className="rounded-full border px-2 py-1">{course.level}</span>
          <span className="rounded-full border px-2 py-1">{course.duration}</span>
          <span className="rounded-full border px-2 py-1">{course.students}+ learners</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-sf-ink">{formatInr(course.price)}</p>
            {course.oldPrice ? <p className="text-xs text-sf-muted line-through">{formatInr(course.oldPrice)}</p> : null}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={() => toggleWishlist(course.id)}>
              {inWishlist ? "Saved" : "Save"}
            </button>
            <button type="button" className="btn-primary" onClick={() => addToCart(course)}>
              Add to Cart
            </button>
          </div>
        </div>
        <Link to={`/courses/${course.slug}`} className="mt-3 inline-block text-sm font-semibold text-sf-goldStrong underline">
          View course details
        </Link>
      </div>
    </motion.article>
  );
}