import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { roleQuickLinks, publicNav } from "../../data/mockData";
import { useLmsStore } from "../../context/LmsStore";
import { BrandLogo } from "./BrandLogo";

export function MainLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { cart } = useLmsStore();
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="page-wrap flex items-center justify-between gap-3 py-3">
          <BrandLogo />

          <button
            type="button"
            className="btn-secondary px-4 py-2 md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/cart" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              Cart ({cartCount})
            </NavLink>
            <Link to="/student/dashboard" className="btn-secondary">
              Student
            </Link>
            <Link to="/instructor/dashboard" className="btn-secondary">
              Instructor
            </Link>
            <Link to="/admin/dashboard" className="btn-primary">
              Admin Panel
            </Link>
          </nav>
        </div>

        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-wrap space-y-2 border-t py-3 md:hidden"
          >
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm ${isActive ? "bg-sf-cream text-sf-ink" : "text-sf-muted"}`}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/cart"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm ${isActive ? "bg-sf-cream text-sf-ink" : "text-sf-muted"}`}
            >
              Cart ({cartCount})
            </NavLink>
            <div className="flex gap-2 pt-1">
              <Link to="/student/dashboard" className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                Student
              </Link>
              <Link to="/admin/dashboard" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                Admin
              </Link>
            </div>
          </motion.div>
        ) : null}
      </header>

      <div className="page-wrap py-5">{children}</div>

      <footer className="mt-10 border-t bg-white/75">
        <div className="page-wrap space-y-5 py-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="kicker">Skillfort Institute</p>
              <p className="mt-2 text-sm text-sf-muted">
                Multi-page LMS frontend scaffold with commerce flow for recorded courses and role-based portals.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Quick Portals</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[...roleQuickLinks.student, ...roleQuickLinks.instructor, ...roleQuickLinks.admin].map((item) => (
                  <Link key={item.to} to={item.to} className="rounded-full border px-3 py-1 text-xs text-sf-muted">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">Contact</p>
              <p className="mt-2 text-sm text-sf-muted">Navalur, Chennai, Tamil Nadu 600130</p>
              <p className="text-sm text-sf-muted">+91 93449 93939 | info@skillfortinstitute.com</p>
            </div>
          </div>
          <div className="border-t pt-4 text-xs text-sf-muted">
            {`Current Route: ${location.pathname} | Copyright ${new Date().getFullYear()} Skillfort`}
          </div>
        </div>
      </footer>
    </div>
  );
}