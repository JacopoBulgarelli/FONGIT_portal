"use client";

import { StepHeader } from "@/components/ui";
import { useApplicationStore } from "@/lib/form-store";

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="text-sm leading-7 text-gray-600">
      <span className="font-medium text-gray-800">{label}:</span> {value}
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 bg-white rounded-md border-[1.5px] border-gray-200 mb-2.5">
      <div className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

export function StepReview() {
  const { company, team, project, marketIP, fongitFit, documents } =
    useApplicationStore();

  return (
    <div className="animate-slide-in">
      <StepHeader
        number="✓"
        title="Review & Submit"
        subtitle="Please review your application before submitting."
      />

      <ReviewSection title="Company">
        <ReviewRow label="Name" value={company.name} />
        <ReviewRow label="Website" value={company.website} />
        <ReviewRow label="Description" value={company.shortDescription} />
        <ReviewRow label="Location" value={company.location} />
        <ReviewRow label="Founded" value={company.foundedDate} />
        <ReviewRow label="Stage" value={company.stage} />
        <ReviewRow label="Revenue (30d)" value={company.revenueLast30d} />
        <ReviewRow label="Revenue (12m)" value={company.revenueLast12m} />
        <ReviewRow label="Incorporated" value={company.isIncorporated} />
        {company.customerTypes.length > 0 && (
          <ReviewRow label="Customers" value={company.customerTypes.join(", ")} />
        )}
        {company.productChannels.length > 0 && (
          <ReviewRow label="Channels" value={company.productChannels.join(", ")} />
        )}
        <ReviewRow label="Markets" value={company.markets} />
      </ReviewSection>

      <ReviewSection title="Team">
        {team.map((m, i) => (
          <div key={m.id} className={i > 0 ? "mt-3 pt-3 border-t border-gray-100" : ""}>
            <div className="font-medium text-gray-800 text-sm">
              {m.firstName} {m.lastName}
              {m.role && <span className="font-normal text-gray-500"> — {m.role}</span>}
            </div>
            {m.email && <div className="text-sm text-gray-500">{m.email}</div>}
          </div>
        ))}
      </ReviewSection>

      <ReviewSection title="Project">
        <ReviewRow label="Problem" value={project.problemStatement} />
        <ReviewRow label="Differentiation" value={project.differentiation} />
        <ReviewRow label="Status" value={project.statusAchievements} />
        <ReviewRow label="Raising" value={project.raisingMoney} />
        <ReviewRow label="Total raised" value={project.totalRaised} />
        <ReviewRow label="Runway" value={project.runwayMonths ? `${project.runwayMonths} months` : undefined} />
      </ReviewSection>

      <ReviewSection title="Market & IP">
        <ReviewRow label="IP" value={marketIP.intellectualProperty} />
        <ReviewRow label="Prior support" value={marketIP.priorSupport} />
        {marketIP.researchOrgs.length > 0 && (
          <ReviewRow label="Research orgs" value={marketIP.researchOrgs.join(", ")} />
        )}
      </ReviewSection>

      <ReviewSection title="FONGIT Fit">
        {fongitFit.genevaStatus.length > 0 && (
          <ReviewRow label="Geneva status" value={fongitFit.genevaStatus.join(", ")} />
        )}
        <ReviewRow label="How FONGIT can help" value={fongitFit.howCanFongitHelp} />
        {fongitFit.supportSeeking.length > 0 && (
          <ReviewRow label="Support sought" value={fongitFit.supportSeeking.join(", ")} />
        )}
        <ReviewRow label="Referral" value={fongitFit.referralSource} />
        <ReviewRow label="Contact email" value={fongitFit.backupEmail} />
      </ReviewSection>

      <ReviewSection title="Documents">
        <ReviewRow label="Product video" value={documents.productVideoUrl} />
        <ReviewRow label="Team video" value={documents.teamVideoUrl} />
        {!documents.productVideoUrl && !documents.teamVideoUrl && (
          <div className="text-sm text-gray-400">No video links provided.</div>
        )}
      </ReviewSection>

      <div className="mt-6 px-5 py-4 bg-gray-100 rounded-md text-[13px] text-gray-600 leading-relaxed">
        By submitting, you confirm that all information is accurate and that you
        agree to FONGIT&apos;s confidentiality terms. All data is processed in
        compliance with GDPR.
      </div>
    </div>
  );
}
