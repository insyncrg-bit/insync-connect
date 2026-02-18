import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

export interface Contact {
  name: string;
  title: string;
  email: string;
}

interface ContactListProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
  minContacts?: number;
}

export const ContactList = ({ contacts, onChange, minContacts = 1 }: ContactListProps) => {
  const addContact = () => onChange([...contacts, { name: "", title: "", email: "" }]);
  const removeContact = (index: number) => {
    if (contacts.length > minContacts) onChange(contacts.filter((_, i) => i !== index));
  };
  const updateContact = (index: number, field: keyof Contact, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[hsl(var(--navy-deep))]/80">Contacts</span>
        <Button type="button" variant="outline" size="sm" onClick={addContact} className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
          <Plus className="h-4 w-4 mr-1" />
          Add Contact
        </Button>
      </div>
      {contacts.map((contact, index) => (
        <div key={index} className="bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--navy-deep))]/60 text-sm">Contact {index + 1}</span>
            {contacts.length > minContacts && (
              <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(index)} className="text-red-500 hover:text-red-600 h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Name" value={contact.name} onChange={(e) => updateContact(index, "name", e.target.value)} className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50" />
            <Input placeholder="Title" value={contact.title} onChange={(e) => updateContact(index, "title", e.target.value)} className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50" />
            <Input type="email" placeholder="Email" value={contact.email} onChange={(e) => updateContact(index, "email", e.target.value)} className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50" />
          </div>
        </div>
      ))}
    </div>
  );
};
