import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Mail,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Loader2,
  Building2,
  Shield,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";

interface Member {
  id: string;
  fullName: string;
  email: string;
  title: string;
  role: "admin" | "analyst";
  request_status: "accepted" | "sent" | "rejected";
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface VCOrganisationProps {
  firmId: string;
  isAdmin: boolean;
  firmName?: string;
  companyLogo?: string | null;
}

export const VCOrganisation = ({ firmId, isAdmin, firmName, companyLogo }: VCOrganisationProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [pending, setPending] = useState<Member[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!firmId) return;
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      
      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_FIREBASE_API;
      
      const res = await fetch(`${apiUrl}/api/firms/${firmId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setPending(data.pending || []);
      } else {
        console.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [firmId]);

  const handleAction = async (targetUid: string, action: "approve" | "reject") => {
    setProcessingId(targetUid);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_FIREBASE_API;

      const res = await fetch(`${apiUrl}/api/firms/${firmId}/members/${targetUid}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast({ 
          title: action === "approve" ? "Request Approved" : "Request Rejected",
          description: `User has been ${action === "approve" ? "added to" : "removed from"} the firm.`
        });
        fetchMembers(); // Refresh lists
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Action failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const MemberCard = ({ member, isPending = false }: { member: Member; isPending?: boolean }) => (
    <Card className="bg-white/5 border-white/10 p-5 backdrop-blur-sm hover:border-[hsl(var(--cyan-glow))]/30 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white/10 group-hover:border-[hsl(var(--cyan-glow))]/50 transition-colors">
            {((member as any).profilePicture || (member as any).profileImage) && (
              <AvatarImage 
                src={(member as any).profilePicture || (member as any).profileImage} 
                alt={member.fullName} 
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-navy-card text-[hsl(var(--cyan-glow))] font-medium">
              {getInitials(member.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white truncate">{member.fullName}</h4>
              {member.role === "admin" && (
                <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-none text-[10px] px-1.5 py-0 h-4 uppercase tracking-wider">
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-sm text-white/50 truncate mb-1">{member.title}</p>
            <div className="flex items-center gap-3 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {member.email}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {isPending && isAdmin ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-full"
                onClick={() => handleAction(member.id, "approve")}
                disabled={!!processingId}
              >
                {processingId === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-full"
                onClick={() => handleAction(member.id, "reject")}
                disabled={!!processingId}
              >
                {processingId === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
              </Button>
            </div>
          ) : !isPending && isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/10 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-navy-card border-white/10">
                <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/10 cursor-pointer">
                  Make Admin (coming soon)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-rose-400 focus:text-rose-300 focus:bg-rose-400/10 cursor-pointer">
                  Remove from Firm (coming soon)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
      
      {!isPending && ((member as any).createdAt || (member as any).updatedAt) && (
         <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/20 uppercase tracking-widest font-medium">
            <span className="flex items-center gap-1">
               <Clock className="h-3 w-3" />
               Joined {(() => {
                  const rawDate = (member as any).createdAt || (member as any).updatedAt;
                  if (!rawDate) return "N/A";
                  
                  // Handle cases where it's a Firestore Timestamp object {_seconds, _nanoseconds}
                  if (typeof rawDate === 'object' && rawDate._seconds) {
                    return new Date(rawDate._seconds * 1000).toLocaleDateString();
                  }

                  const d = new Date(rawDate);
                  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
                })()}
            </span>
         </div>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Organisation Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--cyan-glow))]/5 blur-[100px] -mr-32 -mt-32" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/20 flex items-center justify-center overflow-hidden shadow-lg group/logo">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt={firmName} 
                className="w-full h-full object-contain p-2 filter drop-shadow(0 0 8px rgba(6,182,212,0.2)) group-hover/logo:scale-105 transition-transform duration-500" 
              />
            ) : (
              <Building2 className="h-10 w-10 text-[hsl(var(--cyan-glow))]" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{firmName || "My Organization"}</h2>
            <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                {members.length} {members.length === 1 ? "Member" : "Members"}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20 hidden md:block" />
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-xs font-mono tracking-tight text-white/40">
                FIRM_ID: {firmId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests Section (Admin Only) */}
      {isAdmin && pending.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/10 text-amber-400">
                 <UserPlus className="h-4 w-4" />
              </span>
              Pending Requests
              <Badge className="bg-amber-400/20 text-amber-400 border-none ml-2">
                {pending.length}
              </Badge>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.map((member) => (
              <MemberCard key={member.id} member={member} isPending />
            ))}
          </div>
        </section>
      )}

      {/* Team Members Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
               <Shield className="h-4 w-4" />
            </span>
            Team Members
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
};
