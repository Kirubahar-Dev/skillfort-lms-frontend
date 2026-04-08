import { FormEvent, useEffect, useState } from "react";

import { ModuleShell } from "../../components/ModuleShell";
import { apiGet, apiPost } from "../../lib/api";

type Contact = {
  contact_id: string;
  phone_e164: string;
  full_name: string | null;
  opted_out: boolean;
  attributes: Record<string, string>;
};

export function ContactsModule() {
  const [items, setItems] = useState<Contact[]>([]);
  const [phone, setPhone] = useState("+919876543210");
  const [name, setName] = useState("Priya Sharma");

  const loadContacts = () => {
    apiGet<Contact[]>("/contacts").then(setItems).catch(() => setItems([]));
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await apiPost("/contacts", {
      phone_e164: phone,
      full_name: name,
      attributes: {},
    });
    loadContacts();
  };

  return (
    <ModuleShell title="Contacts" subtitle="Upload CSVs, manage groups, and maintain opt-in / opt-out hygiene.">
      <form className="inline-form" onSubmit={onSubmit}>
        <label>Phone (E.164)</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        <label>Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Add Contact</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Contact</th>
            <th>Phone</th>
            <th>Attributes</th>
            <th>Opt Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.contact_id}>
              <td>{item.full_name || "N/A"}</td>
              <td>{item.phone_e164}</td>
              <td>{Object.entries(item.attributes).map(([k, v]) => `${k}=${v}`).join(", ") || "-"}</td>
              <td><span className="badge">{item.opted_out ? "Opted-out" : "Opted-in"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModuleShell>
  );
}
