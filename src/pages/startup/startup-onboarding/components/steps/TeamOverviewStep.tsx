import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Users } from "lucide-react";
import { StartupOnboardingData, TeamMember } from "../../hooks/startupMemoTypes";

interface TeamOverviewStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
}

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const TeamOverviewStep = ({ data, onUpdate, onNext, onBack, nextLabel }: TeamOverviewStepProps) => {
  const addTeamMember = () => {
    onUpdate({
      teamMembers: [...data.teamMembers, { name: "", role: "", linkedin: "", background: "" }],
    });
  };

  const removeTeamMember = (index: number) => {
    if (data.teamMembers.length > 1) {
      onUpdate({
        teamMembers: data.teamMembers.filter((_, i) => i !== index),
      });
    }
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...data.teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ teamMembers: updated });
  };

  const wordCount = countWords(data.companyOverview);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Team & Overview</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Tell us about your team and company overview</p>
      </div>

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">
          Company Overview / Problem Statement * (min 30 words)
        </Label>
        <Textarea
          value={data.companyOverview}
          onChange={(e) => onUpdate({ companyOverview: e.target.value })}
          placeholder="Describe your company, the problem you're solving, and your solution..."
          className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 focus:border-cyan-glow min-h-[150px]"
          rows={6}
        />
        <p className={`text-xs ${wordCount >= 30 ? "text-cyan-glow" : "text-[hsl(var(--navy-deep))]/50"}`}>
          {wordCount} / 30 words
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[hsl(var(--navy-deep))]/80">Team Members</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTeamMember}
            className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {data.teamMembers.map((member, index) => (
          <div key={index} className="bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[hsl(var(--navy-deep))]/60" />
                <span className="text-[hsl(var(--navy-deep))]/80 font-medium">Team Member {index + 1}</span>
              </div>
              {data.teamMembers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTeamMember(index)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[hsl(var(--navy-deep))]/80">Name {index === 0 && "*"}</Label>
                <Input
                  value={member.name}
                  onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                  placeholder="Full name"
                  className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[hsl(var(--navy-deep))]/80">Role {index === 0 && "*"}</Label>
                <Input
                  value={member.role}
                  onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                  placeholder="e.g. CEO, CTO, Co-founder"
                  className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[hsl(var(--navy-deep))]/80">LinkedIn</Label>
                <Input
                  value={member.linkedin}
                  onChange={(e) => updateTeamMember(index, "linkedin", e.target.value)}
                  placeholder="LinkedIn profile URL"
                  className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[hsl(var(--navy-deep))]/80">Background</Label>
                <Input
                  value={member.background}
                  onChange={(e) => updateTeamMember(index, "background", e.target.value)}
                  placeholder="Brief background"
                  className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-white/10 text-[hsl(var(--navy-deep))]">
          Back
        </Button>
        <Button onClick={onNext} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
          {nextLabel ?? "Next"}
        </Button>
      </div>
    </div>
  );
};
