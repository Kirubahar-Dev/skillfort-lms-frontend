import { useEffect, useState } from "react";
import { fetchStaticPage } from "../../services/pageService";

export default function TermsPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchStaticPage("terms-conditions")
      .then((data) => setContent(data.content || ""))
      .catch(() => setContent("Terms content will be updated by admin settings."));
  }, []);

  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl">Terms & Conditions</h1>
      <p className="mt-4 max-w-3xl whitespace-pre-wrap text-slate-600 dark:text-slate-300">{content}</p>
    </div>
  );
}
