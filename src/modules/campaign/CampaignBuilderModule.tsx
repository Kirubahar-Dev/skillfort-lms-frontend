import { FormEvent, useMemo, useState } from "react";

import { ModuleShell } from "../../components/ModuleShell";
import { apiPost } from "../../lib/api";

const steps = [
  "Campaign Setup",
  "CSV Upload",
  "Template Select",
  "Variable Mapping",
  "Test",
  "Schedule",
  "Blast",
  "Analytics",
];

export function CampaignBuilderModule() {
  const [activeStep, setActiveStep] = useState(0);
  const [campaignId, setCampaignId] = useState<string>("");
  const [name, setName] = useState("March Launch");
  const [description, setDescription] = useState("Promo wave");
  const [templateId, setTemplateId] = useState("");
  const [status, setStatus] = useState<string>("");

  const currentStep = useMemo(() => steps[activeStep], [activeStep]);

  const createCampaign = async (event: FormEvent) => {
    event.preventDefault();
    const response = await apiPost<{ campaign_id: string }>("/campaigns", {
      name,
      description,
      template_id: templateId || null,
      timezone: "Asia/Kolkata",
      exclude_opted_out: true,
    });
    setCampaignId(response.campaign_id);
    setStatus(`Created ${response.campaign_id}`);
  };

  const queueBlast = async () => {
    if (!campaignId) {
      setStatus("Create campaign first");
      return;
    }
    await apiPost(`/campaigns/${campaignId}/blast`, { batch_size: 100, messages_per_minute: 1000 });
    setStatus(`Blast queued for ${campaignId}`);
  };

  return (
    <ModuleShell title="Campaign Builder" subtitle="8-step wizard inspired by NeoDove flow with enterprise controls.">
      <section className="wizard">
        <div className="stepper">
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              className={index === activeStep ? "step active" : "step"}
              onClick={() => setActiveStep(index)}
            >
              <div className="step-index">Step {index + 1}</div>
              <div className="step-name">{step}</div>
            </button>
          ))}
        </div>

        <div className="flow-grid">
          <article className="flow-card">
            <h3>Pipeline Flow</h3>
            <div className="flow-row">
              <span className="node">Setup</span><span className="arrow">-&gt;</span>
              <span className="node">Upload CSV</span><span className="arrow">-&gt;</span>
              <span className="node">Select Template</span><span className="arrow">-&gt;</span>
              <span className="node">Map Variables</span>
            </div>
            <div className="flow-row" style={{ marginTop: 8 }}>
              <span className="node">Test Campaign</span><span className="arrow">-&gt;</span>
              <span className="node">Schedule (TZ)</span><span className="arrow">-&gt;</span>
              <span className="node">Blast Queue</span><span className="arrow">-&gt;</span>
              <span className="node">Analytics</span>
            </div>
          </article>

          <article className="form-card">
            <h3>{currentStep}</h3>
            <form className="inline-form" onSubmit={createCampaign}>
              <label>Campaign Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <label>Description</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} />
              <label>Template ID (optional)</label>
              <input value={templateId} onChange={(e) => setTemplateId(e.target.value)} />
              <div className="button-row">
                <button type="submit">Create</button>
                <button type="button" onClick={queueBlast}>Queue Blast</button>
              </div>
            </form>
            <p className="module-subtitle">{status || "Create campaign, then queue blast."}</p>
            <p className="module-subtitle">Current Campaign ID: {campaignId || "N/A"}</p>
          </article>
        </div>
      </section>
    </ModuleShell>
  );
}
