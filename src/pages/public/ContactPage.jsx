import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/contact", form);
      toast.success("Message sent successfully");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Unable to send your message");
    }
  };

  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Contact Us</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl border p-6 dark:border-white/10 md:grid-cols-2">
        {Object.keys(form).map((key) => (
          key === "message" ? (
            <textarea key={key} className="md:col-span-2 rounded-lg border p-2 bg-transparent" rows="5" placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          ) : (
            <input key={key} className="rounded-lg border p-2 bg-transparent" placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          )
        ))}
        <button className="md:col-span-2 rounded-lg bg-brand-primary py-3 font-semibold text-slate-900">Submit</button>
      </form>
    </div>
  );
}
