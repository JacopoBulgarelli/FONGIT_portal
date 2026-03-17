"use client";

import { Input, SelectButtons, StepHeader } from "@/components/ui";
import { GENEVA_OPTIONS, SUPPORT_OPTIONS } from "@/lib/constants";
import { useApplicationStore } from "@/lib/form-store";
import type { GenevaStatus, SupportType } from "@/lib/types";

export function StepFongitFit() {
  const { fongitFit, setFongitFit } = useApplicationStore();

  return (
    <div className="animate-slide-in">
      <StepHeader
        number="05"
        title="FONGIT Fit"
        subtitle="Help us understand how we can best support your journey."
      />

      <SelectButtons
        label="Is your project based in Geneva?"
        options={GENEVA_OPTIONS}
        multi
        value={fongitFit.genevaStatus}
        onChange={(v) => setFongitFit({ genevaStatus: v as GenevaStatus[] })}
      />

      <Input
        label="Residency & permit details"
        type="textarea"
        placeholder="If based in/near Geneva, indicate your permit type. If not, explain your strategic reasons for relocating."
        sublabel="You must have a valid residency and work permit for Switzerland."
        value={fongitFit.permitDetails}
        onChange={(v) => setFongitFit({ permitDetails: v })}
      />

      <Input
        label="How can FONGIT help you?"
        required
        type="textarea"
        placeholder="Why do you want to join FONGIT? What kind of support are you looking for?"
        value={fongitFit.howCanFongitHelp}
        onChange={(v) => setFongitFit({ howCanFongitHelp: v })}
      />

      <SelectButtons
        label="What support are you seeking?"
        sublabel="Select all that apply."
        options={SUPPORT_OPTIONS}
        multi
        value={fongitFit.supportSeeking}
        onChange={(v) => setFongitFit({ supportSeeking: v as SupportType[] })}
      />

      <Input
        label="How did you hear about FONGIT?"
        type="textarea"
        placeholder="Is there someone who recommended you? Who can we contact for a reference?"
        value={fongitFit.referralSource}
        onChange={(v) => setFongitFit({ referralSource: v })}
      />

      <Input
        label="Best email to reach you"
        type="email"
        required
        placeholder="name@company.com"
        sublabel="Backup contact — so we can be sure to reach you for follow-up."
        value={fongitFit.backupEmail}
        onChange={(v) => setFongitFit({ backupEmail: v })}
      />
    </div>
  );
}
