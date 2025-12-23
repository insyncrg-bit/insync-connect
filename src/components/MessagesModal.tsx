import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, MessageSquare, Calendar, Send, Maximize2, Minimize2, Video, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";

interface MessageThread {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_company: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  calendly_link?: string;
  messages: Array<{
    id: string;
    sender: "self" | "other";
    content: string;
    timestamp: string;
  }>;
}

interface SyncContact {
  id: string;
  other_user_id: string;
  company_name?: string;
  firm_name?: string;
  founder_name?: string;
  calendly_link?: string;
}

interface MessagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threads: MessageThread[];
  loading: boolean;
  userType: "founder" | "investor";
  onSendMessage?: (receiverUserId: string, content: string) => Promise<boolean>;
  onMarkAsRead?: (otherUserId: string) => void;
  activeSyncs?: SyncContact[];
}

export function MessagesModal({ 
  open, 
  onOpenChange, 
  threads, 
  loading,
  userType,
  onSendMessage,
  onMarkAsRead,
  activeSyncs = []
}: MessagesModalProps) {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [selectedNewContact, setSelectedNewContact] = useState<SyncContact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleSendMessage = async () => {
    const targetUserId = selectedThread?.other_user_id || selectedNewContact?.other_user_id;
    if (!newMessage.trim() || !targetUserId || !onSendMessage || sending) return;
    
    setSending(true);
    const success = await onSendMessage(targetUserId, newMessage);
    if (success) {
      setNewMessage("");
      // If it was a new conversation, reset state
      if (selectedNewContact) {
        setSelectedNewContact(null);
        setShowNewConversation(false);
      }
    }
    setSending(false);
  };

  const handleSelectThread = (thread: MessageThread) => {
    setSelectedThread(thread);
    setSelectedNewContact(null);
    setShowNewConversation(false);
    onMarkAsRead?.(thread.other_user_id);
  };

  const handleStartNewConversation = (sync: SyncContact) => {
    // Check if there's already a thread with this user
    const existingThread = threads.find(t => t.other_user_id === sync.other_user_id);
    if (existingThread) {
      handleSelectThread(existingThread);
    } else {
      setSelectedNewContact(sync);
      setSelectedThread(null);
      setShowNewConversation(false);
    }
  };

  // Get syncs that don't have a thread yet
  const syncsWithoutThreads = activeSyncs.filter(
    sync => !threads.some(thread => thread.other_user_id === sync.other_user_id)
  );

  // Update selected thread when threads change (realtime updates)
  useEffect(() => {
    if (selectedThread) {
      const updatedThread = threads.find(t => t.id === selectedThread.id);
      if (updatedThread) {
        setSelectedThread(updatedThread);
      }
    }
  }, [threads, selectedThread?.id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current && selectedThread) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedThread?.messages.length]);

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setSelectedThread(null);
        setSelectedNewContact(null);
        setShowNewConversation(false);
      }
    }}>
      <DialogContent className={`bg-[hsl(var(--navy-deep))] border-white/10 text-white overflow-hidden p-0 transition-all duration-300 ${
        isFullscreen 
          ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none" 
          : "max-w-3xl max-h-[80vh]"
      }`}>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
              Messages
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-[hsl(var(--cyan-glow))] border-t-transparent rounded-full" />
          </div>
        ) : threads.length === 0 && activeSyncs.length === 0 ? (
          <div className="text-center py-12 px-6">
            <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-white/60 text-sm">
              {userType === "founder" 
                ? "Start a conversation by syncing with investors."
                : "Start a conversation by syncing with startups."}
            </p>
          </div>
        ) : threads.length === 0 && activeSyncs.length > 0 ? (
          // Show active syncs to start a conversation
          <div className="p-6 pt-4">
            <div className="text-center mb-6">
              <MessageSquare className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-1">No messages yet</h3>
              <p className="text-white/60 text-sm">Start a conversation with your active syncs</p>
            </div>
            <div className="space-y-2">
              {activeSyncs.map((sync) => (
                <div
                  key={sync.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => handleStartNewConversation(sync)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">
                        {userType === "founder" ? sync.firm_name : sync.company_name}
                      </h4>
                      {sync.founder_name && (
                        <p className="text-xs text-white/50">{sync.founder_name}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30 border border-[hsl(var(--cyan-glow))]/30"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Start Chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : selectedNewContact ? (
          // New conversation view
          <div className={`flex flex-col ${isFullscreen ? "h-[calc(100vh-100px)]" : "h-[60vh]"}`}>
            <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedNewContact(null)}
                  className="text-white/60 hover:text-white"
                >
                  ← Back
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">
                      {userType === "founder" ? selectedNewContact.firm_name : selectedNewContact.company_name}
                    </p>
                    {selectedNewContact.founder_name && (
                      <p className="text-xs text-white/50">{selectedNewContact.founder_name}</p>
                    )}
                  </div>
                </div>
              </div>
              {selectedNewContact.calendly_link && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  onClick={() => window.open(selectedNewContact.calendly_link, '_blank')}
                >
                  <Video className="mr-1 h-3 w-3" />
                  Schedule Meeting
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <MessageSquare className="h-10 w-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 text-sm">Send a message to start the conversation</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                disabled={sending}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : selectedThread ? (
          // Thread view
          <div className={`flex flex-col ${isFullscreen ? "h-[calc(100vh-100px)]" : "h-[60vh]"}`}>
            <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
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
              {selectedThread.calendly_link && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  onClick={() => window.open(selectedThread.calendly_link, '_blank')}
                >
                  <Video className="mr-1 h-3 w-3" />
                  Schedule Meeting
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
            
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-3">
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
            </ScrollArea>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                disabled={sending}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Thread list view
          <ScrollArea className={`p-6 pt-4 ${isFullscreen ? "h-[calc(100vh-100px)]" : "max-h-[60vh]"}`}>
            {/* New conversation button if there are syncs without threads */}
            {syncsWithoutThreads.length > 0 && (
              <div className="mb-4">
                <Button
                  onClick={() => setShowNewConversation(!showNewConversation)}
                  className="w-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/20 border border-[hsl(var(--cyan-glow))]/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Conversation
                </Button>
                
                {showNewConversation && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-white/50 mb-2">Select a sync to message:</p>
                    {syncsWithoutThreads.map((sync) => (
                      <div
                        key={sync.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleStartNewConversation(sync)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white text-sm">
                              {userType === "founder" ? sync.firm_name : sync.company_name}
                            </h4>
                            {sync.founder_name && (
                              <p className="text-xs text-white/50">{sync.founder_name}</p>
                            )}
                          </div>
                          <MessageSquare className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {threads.length > 0 && (
              <div className={`${isFullscreen ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}`}>
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSelectThread(thread)}
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
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
