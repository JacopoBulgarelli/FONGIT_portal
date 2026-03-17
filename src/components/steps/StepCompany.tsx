"use client";

import { Input, SelectButtons, StepHeader } from "@/components/ui";
import {
  STAGE_OPTIONS,
  CUSTOMER_OPTIONS,
  CHANNEL_OPTIONS,
  INCORPORATED_OPTIONS,
} from "@/lib/constants";
import { useApplicationStore } from "@/lib/form-store";
import type { CustomerType, ProductChannel } from "@/lib/types";

export function StepCompany() {
  const { company, setCompany } = useApplicationStore();

  return (
    <div className="animate-slide-in">
      <StepHeader
        number="01"
        title="Company Basics"
        subtitle="Tell us about your startup or project."
      />

      <div className="grid grid-cols-2 gap-x-5">
        <Input
          label="Company Name"
          required
          placeholder="e.g. NeuroLink AI"
          value={company.name}
          onChange={(v) => setCompany({ name: v })}
        />
        <Input
          label="Website"
          placeholder="https://"
          value={company.website}
          onChange={(v) => setCompany({ website: v })}
        />
      </div>

      <Input
        label="Short Description"
        required
        placeholder="One sentence about what you do"
        sublabel="Keep it concise — this will be the first thing our team reads."
        value={company.shortDescription}
        onChange={(v) => setCompany({ shortDescription: v })}
      />

      <div className="grid grid-cols-2 gap-x-5">
        <Input
          label="Location"
          required
          placeholder="City, Country"
          value={company.location}
          onChange={(v) => setCompany({ location: v })}
        />
        <Input
          label="Founded"
          type="month"
          value={company.foundedDate}
          onChange={(v) => setCompany({ foundedDate: v })}
        />
      </div>

      <SelectButtons
        label="What stage are you at?"
        options={STAGE_OPTIONS}
        value={company.stage}
        onChange={(v) => setCompany({ stage: v as typeof company.stage })}
      />

      <div className="grid grid-cols-2 gap-x-5">
        <Input
          label="Revenue (last month)"
          placeholder="CHF 0"
          value={company.revenueLast30d}
          onChange={(v) => setCompany({ revenueLast30d: v })}
        />
        <Input
          label="Revenue (last 12 months)"
          placeholder="CHF 0"
          value={company.revenueLast12m}
          onChange={(v) => setCompany({ revenueLast12m: v })}
        />
      </div>

      <Input
        label="What do you do in detail?"
        type="textarea"
        placeholder="Describe your product or service in detail..."
        value={company.detailedDescription}
        onChange={(v) => setCompany({ detailedDescription: v })}
      />

      <Input
        label="What's different about your company?"
        type="textarea"
        placeholder="What makes you stand out?"
        sublabel="Your unique angle, competitive advantage, or unfair advantage."
        value={company.differentiation}
        onChange={(v) => setCompany({ differentiation: v })}
      />

      <SelectButtons
        label="Are you registered or incorporated?"
        options={INCORPORATED_OPTIONS}
        value={company.isIncorporated}
        onChange={(v) => setCompany({ isIncorporated: v as typeof company.isIncorporated })}
      />

      <SelectButtons
        label="Key customers"
        options={CUSTOMER_OPTIONS}
        multi
        value={company.customerTypes}
        onChange={(v) => setCompany({ customerTypes: v as CustomerType[] })}
      />

      <SelectButtons
        label="Product delivery"
        sublabel="How do customers interact with your product?"
        options={CHANNEL_OPTIONS}
        multi
        value={company.productChannels}
        onChange={(v) => setCompany({ productChannels: v as ProductChannel[] })}
      />

      <Input
        label="Markets"
        placeholder="e.g. Healthcare, AI, Sustainability"
        sublabel="What markets or sectors are you targeting?"
        value={company.markets}
        onChange={(v) => setCompany({ markets: v })}
      />
    </div>
  );
}
