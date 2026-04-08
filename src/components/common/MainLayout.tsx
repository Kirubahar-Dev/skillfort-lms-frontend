import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { roleQuickLinks, publicNav } from "../../data/mockData";
import { useLmsStore } from "../../context/LmsStore";
import { useAuth } from "../../lib/auth";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { MouseFluidEffect } from "../effects/MouseFluidEffect";

export function MainLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { cart } = useLmsStore();
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen relative">
      <MouseFluidEffect />
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="page-wrap flex items-center justify-between gap-3 py-3">
          <BrandLogo />

          <div className="flex items-center gap-2">
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

              {/* Auth Links */}
              {!user ? (
                <>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-secondary">
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2 border-l border-gray-300 pl-2 dark:border-gray-700">
                  <span className="text-sm font-medium text-sf-ink dark:text-white">{user.email}</span>
                  <button
                    onClick={logout}
                    className="nav-link text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-wrap space-y-2 border-t border-gray-200 py-3 dark:border-gray-700 md:hidden"
          >
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm ${isActive ? "bg-sf-cream text-sf-ink dark:bg-gray-700 dark:text-white" : "text-sf-muted dark:text-gray-400"}`}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/cart"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm ${isActive ? "bg-sf-cream text-sf-ink dark:bg-gray-700 dark:text-white" : "text-sf-muted dark:text-gray-400"}`}
            >
              Cart ({cartCount})
            </NavLink>

            {/* Auth Links Mobile */}
            {!user ? (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="btn-secondary w-full"
              >
                Logout
              </button>
            )}
          </motion.div>
        ) : null}
      </header>

      <div className="page-wrap py-5">{children}</div>

      <footer className="mt-10 border-t border-gray-200 bg-white/75 dark:border-gray-700 dark:bg-gray-900/75">
        <div className="page-wrap space-y-5 py-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="kicker">SkillFort</p>
              <p className="mt-2 text-sm text-sf-muted dark:text-gray-400">
                Professional learning management system with role-based portals.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-sf-ink dark:text-white">Quick Links</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {/* Show role-aware quick links */}
                {user && user.role === "viewer" && (
                  <>
                    {roleQuickLinks.student.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-full border border-gray-200 px-3 py-1 text-xs text-sf-muted transition hover:border-sf-gold hover:text-sf-ink dark:border-gray-700 dark:text-gray-400 dark:hover:border-yellow-500 dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
                {user && user.role === "manager" && (
                  <>
                    {roleQuickLinks.instructor.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-full border border-gray-200 px-3 py-1 text-xs text-sf-muted transition hover:border-sf-gold hover:text-sf-ink dark:border-gray-700 dark:text-gray-400 dark:hover:border-yellow-500 dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
                {user && (user.role === "admin" || user.role === "super_admin") && (
                  <>
                    {roleQuickLinks.admin.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-full border border-gray-200 px-3 py-1 text-xs text-sf-muted transition hover:border-sf-gold hover:text-sf-ink dark:border-gray-700 dark:text-gray-400 dark:hover:border-yellow-500 dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
                {!user && (
                  <>
                    <Link
                      to="/login"
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-sf-muted transition hover:border-sf-gold hover:text-sf-ink dark:border-gray-700 dark:text-gray-400 dark:hover:border-yellow-500 dark:hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-sf-muted transition hover:border-sf-gold hover:text-sf-ink dark:border-gray-700 dark:text-gray-400 dark:hover:border-yellow-500 dark:hover:text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-sf-ink dark:text-white">Contact</p>
              <p className="mt-2 text-sm text-sf-muted dark:text-gray-400">
                Navalur, Chennai, Tamil Nadu 600130
              </p>
              <p className="text-sm text-sf-muted dark:text-gray-400">+91 93449 93939 | info@skillfortinstitute.com</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 text-xs text-sf-muted dark:border-gray-700 dark:text-gray-400">
            {`Copyright ${new Date().getFullYear()} SkillFort. All rights reserved.`}
          </div>
        </div>
      </footer>
    </div>
  );
}