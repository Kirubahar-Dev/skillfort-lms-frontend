import { useEffect, useState } from "react";

import { ModuleShell } from "../../components/ModuleShell";
import { apiGet } from "../../lib/api";

type DashboardMetrics = {
  active_campaigns: number;
  messages_today: number;
  delivery_rate: number;
  read_rate: number;
};

type CampaignListItem = {
  campaign_id: string;
  name: string;
  status: string;
  sent_count: number;
  failed_count: number;
};

export function DashboardModule() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);

  useEffect(() => {
    apiGet<DashboardMetrics>("/analytics/dashboard").then(setMetrics).catch(() => setMetrics(null));
    apiGet<CampaignListItem[]>("/campaigns").then(setCampaigns).catch(() => setCampaigns([]));
  }, []);

  const kpis = [
    { label: "Messages Today", value: metrics?.messages_today ?? 0 },
    { label: "Delivery Rate", value: `${metrics?.delivery_rate ?? 0}%` },
    { label: "Read Rate", value: `${metrics?.read_rate ?? 0}%` },
    { label: "Active Campaigns", value: metrics?.active_campaigns ?? 0 },
  ];

  return (
    <ModuleShell title="Dashboard" subtitle="Real-time campaign health and throughput across organizations.">
      <div className="grid">
        {kpis.map((kpi) => (
          <article className="kpi" key={kpi.label}>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
          </article>
        ))}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Status</th>
            <th>Sent</th>
            <th>Failure</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.campaign_id}>
              <td>{campaign.name}</td>
              <td><span className="badge">{campaign.status}</span></td>
              <td>{campaign.sent_count}</td>
              <td>{campaign.failed_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModuleShell>
  );
}
