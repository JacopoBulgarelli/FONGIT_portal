"use client";

import { Input, StepHeader } from "@/components/ui";
import { useApplicationStore } from "@/lib/form-store";

export function StepTeam() {
  const { team, setTeamMember, addTeamMember, removeTeamMember } =
    useApplicationStore();

  return (
    <div className="animate-slide-in">
      <StepHeader
        number="02"
        title="Founding Team"
        subtitle="Investors bet on people as much as ideas. Tell us about your team."
      />

      {team.map((member, i) => (
        <div
          key={member.id}
          className="p-6 bg-white rounded-xl border-[1.5px] border-gray-200 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold tracking-widest uppercase text-gray-500">
              {i === 0 ? "Lead Founder" : `Team Member ${i + 1}`}
            </div>
            {i > 0 && (
              <button
                type="button"
                onClick={() => removeTeamMember(i)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-5">
            <Input
              label="First Name"
              required
              placeholder="First name"
              value={member.firstName}
              onChange={(v) => setTeamMember(i, { firstName: v })}
            />
            <Input
              label="Last Name"
              required
              placeholder="Last name"
              value={member.lastName}
              onChange={(v) => setTeamMember(i, { lastName: v })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            required
            placeholder="name@company.com"
            value={member.email}
            onChange={(v) => setTeamMember(i, { email: v })}
          />
          <Input
            label="Role"
            placeholder="e.g. CTO, CEO, Head of Product"
            value={member.role}
            onChange={(v) => setTeamMember(i, { role: v })}
          />
          <Input
            label="Describe yourself"
            type="textarea"
            placeholder="Background, experience, and what you bring to the project..."
            value={member.description}
            onChange={(v) => setTeamMember(i, { description: v })}
          />
          <Input
            label="Skills"
            placeholder="e.g. Machine Learning, Business Strategy, Biotech"
            value={member.skills}
            onChange={(v) => setTeamMember(i, { skills: v })}
          />
          <Input
            label="Something amazing you built"
            type="textarea"
            placeholder="Tell us about a project or achievement you're proud of..."
            value={member.amazingBuild}
            onChange={(v) => setTeamMember(i, { amazingBuild: v })}
          />

          <div className="grid grid-cols-2 gap-x-5">
            <Input
              label="LinkedIn"
              placeholder="https://linkedin.com/in/..."
              value={member.linkedin}
              onChange={(v) => setTeamMember(i, { linkedin: v })}
            />
            <Input
              label="Phone"
              placeholder="+41..."
              value={member.phone}
              onChange={(v) => setTeamMember(i, { phone: v })}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTeamMember}
        className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-gray-300 transition-colors"
      >
        + Add another team member
      </button>
    </div>
  );
}
