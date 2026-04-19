import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, ShoppingCart } from "lucide-react";
import logo from "../../assets/skillfort_only_logo.png";
import { useTheme } from "../../context/ThemeContext";
import { getRoleHomePath, useAuth } from "../../context/AuthContext";

const links = [
  ["Home", "/"],
  ["About", "/about-us"],
  ["Courses", "/courses"],
  ["Interview Prep", "/interview-prep"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#0d0d18]/85">
      <nav className="container-wide flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Skillfort" className="h-9 w-9" />
          <span className="font-heading text-xl font-bold tracking-tight">SKILLFORT</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-xl border border-slate-200 p-1 dark:border-white/10 md:flex">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-300 p-2 dark:border-white/20"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/cart" className="relative rounded-lg border border-slate-300 p-2 dark:border-white/20">
            <ShoppingCart size={16} />
            <span className="absolute -right-1 -top-1 rounded-full bg-brand-secondary px-1 text-[10px] text-white">2</span>
          </Link>
          {!user ? (
            <>
              <Link className="hidden text-sm font-medium md:block" to="/login">
                Login
              </Link>
              <Link className="rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white" to="/register">
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold dark:border-white/20" to={getRoleHomePath(user.role)}>
                My Portal
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
