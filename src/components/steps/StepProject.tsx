"use client";

import { Input, SelectButtons, StepHeader } from "@/components/ui";
import { RAISING_OPTIONS } from "@/lib/constants";
import { useApplicationStore } from "@/lib/form-store";
import type { ProjectInfo } from "@/lib/types";

export function StepProject() {
  const { project, setProject } = useApplicationStore();

  return (
    <div className="animate-slide-in">
      <StepHeader
        number="03"
        title="Your Project"
        subtitle="Help us understand the problem you're solving and where you stand today."
      />

      <Input
        label="What problem are you solving?"
        required
        type="textarea"
        placeholder="Describe the problem and its scale (people affected, market size, etc.)"
        sublabel="Be specific about the size and urgency of the problem."
        value={project.problemStatement}
        onChange={(v) => setProject({ problemStatement: v })}
      />

      <Input
        label="What do you do differently?"
        required
        type="textarea"
        placeholder="How do you compare to the competition or state of the art? What's your unfair advantage?"
        sublabel="Competition, state of the art, USP, unfair competitive advantage."
        value={project.differentiation}
        onChange={(v) => setProject({ differentiation: v })}
      />

      <Input
        label="Project status & achievements"
        type="textarea"
        placeholder="What have you achieved to date? Prototype? First users? Awards?"
        sublabel="Are you at the idea stage? Do you have a prototype? Is the company incorporated?"
        value={project.statusAchievements}
        onChange={(v) => setProject({ statusAchievements: v })}
      />

      <SelectButtons
        label="Are you raising money?"
        options={RAISING_OPTIONS}
        value={project.raisingMoney}
        onChange={(v) => setProject({ raisingMoney: v as ProjectInfo["raisingMoney"] })}
      />

      <div className="grid grid-cols-2 gap-x-5">
        <Input
          label="Total raised from investors"
          placeholder="CHF 0"
          value={project.totalRaised}
          onChange={(v) => setProject({ totalRaised: v })}
        />
        <Input
          label="Runway remaining (months)"
          placeholder="e.g. 12"
          value={project.runwayMonths}
          onChange={(v) => setProject({ runwayMonths: v })}
        />
      </div>

      <Input
        label="Investors & equity holders"
        type="textarea"
        placeholder="List current investors, if any..."
        value={project.investors}
        onChange={(v) => setProject({ investors: v })}
      />
    </div>
  );
}
