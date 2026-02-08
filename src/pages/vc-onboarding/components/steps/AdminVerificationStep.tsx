import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import { LOCATION_BRANCHES } from "../../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminVerificationStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AdminVerificationStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: AdminVerificationStepProps) => {
  const addContact = () => {
    onUpdate({
      contacts: [...data.contacts, { name: "", title: "", email: "" }],
    });
  };

  const removeContact = (index: number) => {
    if (data.contacts.length > 1) {
      onUpdate({
        contacts: data.contacts.filter((_, i) => i !== index),
      });
    }
  };

  const updateContact = (index: number, field: string, value: string) => {
    const updated = [...data.contacts];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ contacts: updated });
  };

  const toggleLocationBranch = (location: string) => {
    const updated = data.otherLocationBranches.includes(location)
      ? data.otherLocationBranches.filter((l) => l !== location)
      : [...data.otherLocationBranches, location];
    onUpdate({ otherLocationBranches: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Admin & Verification</h2>
        <p className="text-white/60 text-sm">
          Set up your firm's basic information and admin details.
        </p>
      </div>

      <div className="space-y-5">
        {/* Firm Name */}
        <div className="space-y-2">
          <Label htmlFor="firmName" className="text-white/80">
            Firm Name *
          </Label>
          <Input
            id="firmName"
            value={data.firmName}
            onChange={(e) => onUpdate({ firmName: e.target.value })}
            placeholder="Your VC firm name"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-white/80">
            Website
          </Label>
          <Input
            id="website"
            type="url"
            value={data.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
            placeholder="https://yourfirm.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow"
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="companyLinkedIn" className="text-white/80">
            Company LinkedIn
          </Label>
          <Input
            id="companyLinkedIn"
            type="url"
            value={data.companyLinkedIn}
            onChange={(e) => onUpdate({ companyLinkedIn: e.target.value })}
            placeholder="https://linkedin.com/company/yourfirm"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow"
          />
        </div>

        {/* HQ Location */}
        <div className="space-y-2">
          <Label htmlFor="hqLocation" className="text-white/80">
            Headquarters Location *
          </Label>
          <Input
            id="hqLocation"
            value={data.hqLocation}
            onChange={(e) => onUpdate({ hqLocation: e.target.value })}
            placeholder="City, State/Country"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow"
          />
        </div>

        {/* Other Locations */}
        <div className="space-y-2">
          <Label className="text-white/80">Other Location Branches</Label>
          <div className="flex flex-wrap gap-2">
            {LOCATION_BRANCHES.map((location) => (
              <button
                key={location}
                type="button"
                onClick={() => toggleLocationBranch(location)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  data.otherLocationBranches.includes(location)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white/80">Contacts</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addContact}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </Button>
          </div>
          {data.contacts.map((contact, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Contact {index + 1}</span>
                {data.contacts.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(index)}
                    className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
                <Input
                  placeholder="Title"
                  value={contact.title}
                  onChange={(e) => updateContact(index, "title", e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={contact.email}
                  onChange={(e) => updateContact(index, "email", e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Public Profile */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
          <div>
            <Label className="text-white/80">Public Profile</Label>
            <p className="text-white/60 text-sm">
              Make your firm profile visible to startups
            </p>
          </div>
          <Switch
            checked={data.publicProfile}
            onCheckedChange={(checked) => onUpdate({ publicProfile: checked })}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-white/10 text-white">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
