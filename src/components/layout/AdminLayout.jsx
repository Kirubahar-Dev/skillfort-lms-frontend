import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menu = [
  ["Dashboard", "/admin/dashboard"],
  ["Courses", "/admin/courses"],
  ["Students", "/admin/students"],
  ["Instructors", "/admin/instructors"],
  ["Categories", "/admin/categories"],
  ["Orders", "/admin/orders"],
  ["Coupons", "/admin/coupons"],
  ["Reviews", "/admin/reviews"],
  ["Certificates", "/admin/certificates"],
  ["Interview Prep", "/admin/interview-prep"],
  ["Settings", "/admin/settings"],
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container-wide grid min-h-screen grid-cols-1 gap-6 py-6 md:grid-cols-[250px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 font-heading text-xl">Admin Panel</h2>
        <div className="space-y-1">
          {menu.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "hover:bg-slate-100 dark:hover:bg-white/10"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        <div className="mt-4 grid gap-2">
          <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => navigate("/public-home")}>
            Back to Public Site
          </button>
          <button
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
