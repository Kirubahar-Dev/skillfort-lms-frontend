import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../../components/ui/CourseCard";
import { fetchCourses } from "../../services/courseService";
import { fallbackCourses } from "../../utils/mockData";

const categories = ["Full Stack Training", "Python", "Java", "Oracle", "AWS", "Data Analyst"];

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    price: searchParams.get("price") || "all",
    sort: searchParams.get("sort") || "latest",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCourses(filters);
        setCourses((data.items || []).filter((c) => c.status !== "draft"));
      } catch {
        setCourses(fallbackCourses.filter((c) => c.status !== "draft"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v && v !== "all"));
    setSearchParams(clean);
  };

  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Courses</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-2xl border p-5 dark:border-white/10">
          <div>
            <h2 className="font-semibold">Category</h2>
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" checked={filters.category === ""} onChange={() => updateFilter("category", "")} /> All Categories
              </label>
              {categories.map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <input type="radio" checked={filters.category === c} onChange={() => updateFilter("category", c)} /> {c}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Price</h2>
            <select className="mt-2 w-full rounded-lg border p-2 bg-transparent" value={filters.price} onChange={(e) => updateFilter("price", e.target.value)}>
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <h2 className="font-semibold">Sort</h2>
            <select className="mt-2 w-full rounded-lg border p-2 bg-transparent" value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)}>
              <option value="latest">Latest to Oldest</option>
              <option value="oldest">Oldest to Latest</option>
              <option value="price_low">Price Low-High</option>
              <option value="price_high">Price High-Low</option>
            </select>
          </div>
        </aside>
        <section>
          <p className="mb-4 text-sm text-slate-500">Total {courses.length} courses found</p>
          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
