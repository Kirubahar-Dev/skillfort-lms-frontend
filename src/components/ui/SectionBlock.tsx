import { ReactNode } from "react";

interface SectionBlockProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function SectionBlock({ title, description, action, children }: SectionBlockProps) {
  return (
    <section className="panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="section-title">{title}</h2>
          {description ? <p className="mt-2 text-sm text-sf-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}