import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getStudentProfile, updateStudentProfile, uploadStudentPhoto } from "../../services/studentService";

export default function EditProfilePage() {
  const [form, setForm] = useState({ full_name: "", phone: "", city: "", bio: "", email: "", photo_url: "" });

  useEffect(() => {
    getStudentProfile().then((d) => setForm((s) => ({ ...s, ...d }))).catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await updateStudentProfile({ full_name: form.full_name, phone: form.phone, city: form.city, bio: form.bio });
    toast.success("Profile updated");
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await uploadStudentPhoto(file);
    setForm((s) => ({ ...s, photo_url: res.file_path }));
    toast.success("Photo uploaded");
  };

  return (
    <div>
      <h1 className="font-heading text-4xl">Edit Profile</h1>
      <form onSubmit={save} className="mt-4 grid gap-3 rounded-xl border p-4 dark:border-white/10 md:grid-cols-2">
        <input className="rounded border p-2 bg-transparent" placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input className="rounded border p-2 bg-transparent" placeholder="Email" value={form.email} disabled />
        <input className="rounded border p-2 bg-transparent" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="rounded border p-2 bg-transparent" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <textarea className="md:col-span-2 rounded border p-2 bg-transparent" rows="4" placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <div className="md:col-span-2">
          <label className="text-sm">Profile Photo</label>
          <input type="file" className="mt-1 block" accept=".jpg,.jpeg,.png,.webp" onChange={onUpload} />
          {form.photo_url ? <p className="mt-1 break-all text-xs text-slate-500">{form.photo_url}</p> : null}
        </div>
        <button className="md:col-span-2 rounded bg-brand-primary py-2 text-slate-900">Save Profile</button>
      </form>
    </div>
  );
}
