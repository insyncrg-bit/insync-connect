import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import {
  DECISION_PROCESS,
  RESPONSE_TIMES,
  DECISION_TIMES,
  BOARD_INVOLVEMENT,
} from "../../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DealMechanicsStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const DealMechanicsStep = ({
  data,
  onUpdate,
  onSubmit,
  onBack,
}: DealMechanicsStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">
          Deal Mechanics (Optional)
        </h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
          Share details about your deal process. This step is optional.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="decisionProcess" className="text-[hsl(var(--navy-deep))]/80">
            Decision Process
          </Label>
          <Select
            value={data.decisionProcess}
            onValueChange={(value) => onUpdate({ decisionProcess: value })}
          >
            <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
              <SelectValue placeholder="Select decision process" />
            </SelectTrigger>
            <SelectContent>
              {DECISION_PROCESS.map((process) => (
                <SelectItem key={process} value={process}>
                  {process}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeToFirstResponse" className="text-[hsl(var(--navy-deep))]/80">
              Time to First Response
            </Label>
            <Select
              value={data.timeToFirstResponse}
              onValueChange={(value) =>
                onUpdate({ timeToFirstResponse: value })
              }
            >
              <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {RESPONSE_TIMES.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeToDecision" className="text-[hsl(var(--navy-deep))]/80">
              Time to Decision
            </Label>
            <Select
              value={data.timeToDecision}
              onValueChange={(value) => onUpdate({ timeToDecision: value })}
            >
              <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {DECISION_TIMES.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <div>
            <Label className="text-[hsl(var(--navy-deep))]/80">Gives No with Feedback</Label>
            <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
              Do you provide feedback when declining?
            </p>
          </div>
          <Switch
            checked={data.givesNoWithFeedback === true}
            onCheckedChange={(checked) =>
              onUpdate({ givesNoWithFeedback: checked })
            }
          />
        </div>

        {data.givesNoWithFeedback && (
          <div className="space-y-2">
            <Label htmlFor="feedbackWhen" className="text-[hsl(var(--navy-deep))]/80">
              Feedback When
            </Label>
            <Textarea
              id="feedbackWhen"
              value={data.feedbackWhen}
              onChange={(e) => onUpdate({ feedbackWhen: e.target.value })}
              placeholder="Describe when and how you provide feedback..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[80px]"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="followOnReserves" className="text-[hsl(var(--navy-deep))]/80">
              Follow-on Reserves
            </Label>
            <Textarea
              id="followOnReserves"
              value={data.followOnReserves}
              onChange={(e) => onUpdate({ followOnReserves: e.target.value })}
              placeholder="e.g. 50% reserved"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="followOnWhen" className="text-[hsl(var(--navy-deep))]/80">
              Follow-on When
            </Label>
            <Textarea
              id="followOnWhen"
              value={data.followOnWhen}
              onChange={(e) => onUpdate({ followOnWhen: e.target.value })}
              placeholder="Describe follow-on strategy..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="boardInvolvement" className="text-[hsl(var(--navy-deep))]/80">
            Board Involvement
          </Label>
          <Select
            value={data.boardInvolvement}
            onValueChange={(value) => onUpdate({ boardInvolvement: value })}
          >
            <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
              <SelectValue placeholder="Select board involvement" />
            </SelectTrigger>
            <SelectContent>
              {BOARD_INVOLVEMENT.map((involvement) => (
                <SelectItem key={involvement} value={involvement}>
                  {involvement}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
          Back
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
};
