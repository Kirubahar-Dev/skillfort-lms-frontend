import { ReactNode } from "react";

interface PageHeroProps {
  kicker: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHero({ kicker, title, description, actions }: PageHeroProps) {
  return (
    <section className="panel-soft overflow-hidden">
      <p className="kicker">{kicker}</p>
      <h1 className="hero-title mt-2">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm text-sf-muted md:text-base">{description}</p>
      {actions ? <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </section>
  );
}