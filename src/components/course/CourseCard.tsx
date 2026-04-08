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
      className="card-3d rounded-2xl border border-white/20 bg-white/90 backdrop-blur-md p-4 shadow-soft hover:shadow-xl dark:border-gray-700/20 dark:bg-gray-800/90"
    >
      {/* Course Image with Gradient Overlay */}
      <div className="relative h-40 rounded-xl overflow-hidden group">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="kicker text-sf-goldStrong">{course.category}</p>
          <h3 className="mt-2 font-display text-xl font-semibold text-sf-ink dark:text-white line-clamp-2">
            {course.title}
          </h3>
        </div>

        <p className="text-sm text-sf-muted dark:text-gray-400 line-clamp-2">{course.summary}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-sf-line dark:border-gray-700 px-2 py-1 text-sf-muted dark:text-gray-400">
            {course.level}
          </span>
          <span className="rounded-full border border-sf-line dark:border-gray-700 px-2 py-1 text-sf-muted dark:text-gray-400">
            {course.duration}
          </span>
          <span className="rounded-full border border-sf-line dark:border-gray-700 px-2 py-1 text-sf-muted dark:text-gray-400">
            {course.students}+ learners
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-lg font-semibold text-sf-ink dark:text-white">{formatInr(course.price)}</p>
            {course.oldPrice && (
              <p className="text-xs text-sf-muted dark:text-gray-400 line-through">{formatInr(course.oldPrice)}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary text-xs py-2"
              onClick={() => toggleWishlist(course.id)}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {inWishlist ? "♥️" : "🤍"}
            </button>
            <button
              type="button"
              className="btn-primary text-xs py-2"
              onClick={() => addToCart(course)}
            >
              Add
            </button>
          </div>
        </div>

        <Link
          to={`/courses/${course.slug}`}
          className="block text-center mt-3 text-sm font-semibold text-sf-gold dark:text-yellow-400 hover:underline transition-all"
        >
          View Details →
        </Link>
      </div>
    </motion.article>
  );
}