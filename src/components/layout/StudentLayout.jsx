import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markAllNotificationsRead } from "../../services/studentService";
import { useAuth } from "../../context/AuthContext";

const studentMenu = [
  ["Dashboard", "/my-dashboard"],
  ["My Courses", "/my-courses"],
  ["Interview Prep", "/my-interview-prep"],
  ["Orders", "/my-orders"],
  ["Certificates", "/my-certificates"],
  ["Reviews", "/my-reviews"],
  ["Profile", "/edit-profile"],
];

const instructorMenu = [
  ["My Dashboard", "/instructor/dashboard"],
  ["My Courses", "/my-courses"],
  ["Interview Prep", "/my-interview-prep"],
  ["Profile", "/edit-profile"],
];

export default function StudentLayout() {
  const [notif, setNotif] = useState({ unread: 0, items: [] });
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isInstructor = user?.role === "instructor";
  const menu = isInstructor ? instructorMenu : studentMenu;

  const load = () => getNotifications().then(setNotif).catch(() => setNotif({ unread: 0, items: [] }));
  useEffect(() => { load(); }, []);

  return (
    <div className="container-wide grid min-h-screen grid-cols-1 gap-6 py-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 font-heading text-xl">{isInstructor ? "Instructor" : "Student"}</h2>
        <div className="space-y-1">
          {menu.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? "bg-brand-primary text-slate-900" : "hover:bg-slate-100 dark:hover:bg-white/10"
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
        <div className="mb-4 flex justify-end">
          <div className="relative">
            <button className="relative rounded-lg border p-2" onClick={() => setOpen((x) => !x)}>
              <Bell size={18} />
              {notif.unread > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-brand-secondary px-1 text-[10px] text-white">{notif.unread}</span> : null}
            </button>
            {open ? (
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border bg-white p-3 shadow-lg dark:border-white/10 dark:bg-[#141421]">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold">Notifications</p>
                  <button className="text-xs text-brand-primary" onClick={async () => { await markAllNotificationsRead(); load(); }}>Mark all read</button>
                </div>
                <div className="max-h-72 space-y-2 overflow-auto text-sm">
                  {(notif.items || []).map((n) => (
                    <div key={n.id} className={`rounded-lg border p-2 ${n.is_read ? "opacity-70" : ""}`}>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-xs text-slate-500">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <Outlet />
      </section>
    </div>
  );
}
