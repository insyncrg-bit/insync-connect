import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, MessageSquare, Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MessageThread {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_company: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  messages: Array<{
    id: string;
    sender: "self" | "other";
    content: string;
    timestamp: string;
  }>;
}

interface MessagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threads: MessageThread[];
  loading: boolean;
  userType: "founder" | "investor";
}

export function MessagesModal({ 
  open, 
  onOpenChange, 
  threads, 
  loading,
  userType 
}: MessagesModalProps) {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message via Supabase
    setNewMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setSelectedThread(null);
    }}>
      <DialogContent className="bg-[hsl(var(--navy-deep))] border-white/10 text-white max-w-3xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            Messages
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-[hsl(var(--cyan-glow))] border-t-transparent rounded-full" />
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-12 px-6">
            <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-white/60 text-sm">
              {userType === "founder" 
                ? "Start a conversation by syncing with investors."
                : "Start a conversation by syncing with startups."}
            </p>
          </div>
        ) : selectedThread ? (
          // Thread view
          <div className="flex flex-col h-[60vh]">
            <div className="px-6 py-3 border-b border-white/10 flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedThread(null)}
                className="text-white/60 hover:text-white"
              >
                ← Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{selectedThread.other_user_company}</p>
                  <p className="text-xs text-white/50">{selectedThread.other_user_name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedThread.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "self" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      msg.sender === "self" 
                        ? "bg-[hsl(var(--cyan-glow))]/20 text-white" 
                        : "bg-white/5 text-white/90"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-white/40 mt-1">{formatDate(msg.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Thread list view
          <div className="max-h-[60vh] overflow-y-auto p-6 pt-4">
            <div className="space-y-2">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white text-sm truncate">
                          {thread.other_user_company}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50">
                            {formatDate(thread.last_message_time)}
                          </span>
                          {thread.unread_count > 0 && (
                            <Badge className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] text-xs h-5 w-5 p-0 flex items-center justify-center">
                              {thread.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-white/50 mb-1">{thread.other_user_name}</p>
                      <p className="text-sm text-white/70 truncate">{thread.last_message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
