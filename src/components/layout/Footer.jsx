import { Link } from "react-router-dom";
import logo from "../../assets/skillfort_only_logo.png";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-10 dark:border-white/10 dark:bg-[#0d0d18]">
      <div className="container-wide grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <img src={logo} alt="Skillfort" className="h-8 w-8" />
            <span className="font-heading text-lg font-bold">Skillfort Institute</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            1st floor, 3/110, Rajiv Gandhi Salai, Navalur, Chennai 600130
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">+91 93449 93939 | info@skillfortinstitute.com</p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Quick Links</h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <Link className="block" to="/courses">Courses</Link>
            <Link className="block" to="/interview-prep">Interview Prep</Link>
            <Link className="block" to="/about-us">About Us</Link>
            <Link className="block" to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Policy</h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <Link className="block" to="/terms-conditions">Terms & Conditions</Link>
            <Link className="block" to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Social</h3>
          <div className="flex gap-2 text-sm">
            <a className="rounded-full border px-3 py-1" href="https://facebook.com/skillfortinstitute" target="_blank" rel="noreferrer">FB</a>
            <a className="rounded-full border px-3 py-1" href="https://instagram.com/skillfortinstitute" target="_blank" rel="noreferrer">IG</a>
            <a className="rounded-full border px-3 py-1" href="https://www.linkedin.com/company/skillfort-institute" target="_blank" rel="noreferrer">IN</a>
            <a className="rounded-full border px-3 py-1" href="https://x.com/skillfort" target="_blank" rel="noreferrer">X</a>
          </div>
        </div>
      </div>
      <p className="container-wide mt-8 text-xs text-slate-500">© {new Date().getFullYear()} Skillfort Institute LMS. All rights reserved.</p>
    </footer>
  );
}
