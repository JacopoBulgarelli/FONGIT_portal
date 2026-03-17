"use client";

import { Input, SelectButtons, StepHeader } from "@/components/ui";
import { RESEARCH_ORGS } from "@/lib/constants";
import { useApplicationStore } from "@/lib/form-store";
import type { ResearchOrg } from "@/lib/types";

export function StepMarketIP() {
  const { marketIP, setMarketIP } = useApplicationStore();

  return (
    <div className="animate-slide-in">
      <StepHeader
        number="04"
        title="Market & IP"
        subtitle="Intellectual property, prior support, and research connections."
      />

      <Input
        label="Intellectual property"
        type="textarea"
        placeholder="Patents, code, datasets, licenses..."
        sublabel="What IP does your company own? Do you have patents filed or in preparation?"
        value={marketIP.intellectualProperty}
        onChange={(v) => setMarketIP({ intellectualProperty: v })}
      />

      <Input
        label="Prior support & funding"
        type="textarea"
        placeholder="External funding, organizational support (University, Innosuisse, etc.), previous FONGIT applications..."
        sublabel="Have you received any external funding or support from organizations?"
        value={marketIP.priorSupport}
        onChange={(v) => setMarketIP({ priorSupport: v })}
      />

      <SelectButtons
        label="Links with research organizations"
        sublabel="Select any organizations you are connected with."
        options={RESEARCH_ORGS}
        multi
        value={marketIP.researchOrgs}
        onChange={(v) => setMarketIP({ researchOrgs: v as ResearchOrg[] })}
      />
    </div>
  );
}
