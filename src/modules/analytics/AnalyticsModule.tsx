import { useEffect, useState } from "react";

import { ModuleShell } from "../../components/ModuleShell";
import { apiGet } from "../../lib/api";

type Metrics = {
  active_campaigns: number;
  messages_today: number;
  delivery_rate: number;
  read_rate: number;
};

export function AnalyticsModule() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    apiGet<Metrics>("/analytics/dashboard").then(setMetrics).catch(() => setMetrics(null));
  }, []);

  return (
    <ModuleShell title="Analytics" subtitle="Delivery, read, failure, and funnel visibility with campaign-level drill-down.">
      <div className="grid">
        <article className="kpi"><div className="kpi-label">Messages Today</div><div className="kpi-value">{metrics?.messages_today ?? 0}</div></article>
        <article className="kpi"><div className="kpi-label">Delivery Rate</div><div className="kpi-value">{metrics?.delivery_rate ?? 0}%</div></article>
        <article className="kpi"><div className="kpi-label">Read Rate</div><div className="kpi-value">{metrics?.read_rate ?? 0}%</div></article>
        <article className="kpi"><div className="kpi-label">Active Campaigns</div><div className="kpi-value">{metrics?.active_campaigns ?? 0}</div></article>
      </div>
    </ModuleShell>
  );
}
