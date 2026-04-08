import { FormEvent, useEffect, useState } from "react";

import { ModuleShell } from "../../components/ModuleShell";
import { apiGet, apiPost } from "../../lib/api";

type TemplateItem = {
  template_id: string;
  name: string;
  template_type: string;
  language_code: string;
  status: string;
};

export function TemplateStudioModule() {
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [name, setName] = useState("promo_april");
  const [body, setBody] = useState("Hi {{1}}, your offer is live.");

  const loadTemplates = () => {
    apiGet<TemplateItem[]>("/templates").then(setItems).catch(() => setItems([]));
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await apiPost("/templates", {
      name,
      template_type: "TEXT",
      language_code: "en",
      body_text: body,
    });
    loadTemplates();
  };

  return (
    <ModuleShell title="Template Studio" subtitle="Create and manage WhatsApp templates.">
      <form className="inline-form" onSubmit={onSubmit}>
        <label>Template Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Body</label>
        <input value={body} onChange={(e) => setBody(e.target.value)} />
        <button type="submit">Create Template</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Template</th>
            <th>Type</th>
            <th>Language</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.template_id}>
              <td>{item.name}</td>
              <td>{item.template_type}</td>
              <td>{item.language_code}</td>
              <td><span className="badge">{item.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModuleShell>
  );
}
