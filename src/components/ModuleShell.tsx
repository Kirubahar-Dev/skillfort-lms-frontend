import { ReactNode } from "react";

type ModuleShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function ModuleShell({ title, subtitle, children }: ModuleShellProps) {
  return (
    <section className="module-shell">
      <h1 className="module-title">{title}</h1>
      <p className="module-subtitle">{subtitle}</p>
      {children}
    </section>
  );
}
