import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_user_id: string;
  receiver_user_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

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

export function useMessages(currentUserId: string | null, userType: "founder" | "investor") {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchThreads = useCallback(async () => {
    // DISCONNECTED: API calls disabled - returning empty threads
    setLoading(true);
    setTimeout(() => {
      setThreads([]);
      setLoading(false);
    }, 500);

    /* ORIGINAL API CALLS - DISCONNECTED
    if (!currentUserId) return;

    setLoading(true);
    try {
      // Fetch all messages where user is sender or receiver
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_user_id.eq.${currentUserId},receiver_user_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!messages || messages.length === 0) {
        setThreads([]);
        setLoading(false);
        return;
      }

      // Group messages by conversation partner
      const conversationMap = new Map<string, Message[]>();

      messages.forEach((msg) => {
        const otherUserId = msg.sender_user_id === currentUserId
          ? msg.receiver_user_id
          : msg.sender_user_id;

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, []);
        }
        conversationMap.get(otherUserId)!.push(msg);
      });

      // Fetch user info for each conversation partner
      const threadPromises = Array.from(conversationMap.entries()).map(async ([otherUserId, msgs]) => {
        // Get user info based on their type (opposite of current user)
        let userInfo: { name: string; company: string; calendly_link?: string } = { name: "Unknown", company: "Unknown" };

        if (userType === "founder") {
          // Current user is founder, so other user is investor
          const { data: investor } = await supabase
            .from("investor_applications")
            .select("firm_name, calendly_link")
            .eq("user_id", otherUserId)
            .single();

          if (investor) {
            userInfo = { name: "Investor", company: investor.firm_name, calendly_link: investor.calendly_link || undefined };
          }
        } else {
          // Current user is investor, so other user is founder
          const { data: founder } = await supabase
            .from("founder_applications")
            .select("founder_name, company_name, calendly_link")
            .eq("user_id", otherUserId)
            .single();

          if (founder) {
            userInfo = { name: founder.founder_name, company: founder.company_name, calendly_link: founder.calendly_link || undefined };
          }
        }

        // Sort messages by date (oldest first for display)
        const sortedMsgs = [...msgs].sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        const unreadCount = msgs.filter(
          m => m.receiver_user_id === currentUserId && !m.read
        ).length;

        return {
          id: otherUserId,
          other_user_id: otherUserId,
          other_user_name: userInfo.name,
          other_user_company: userInfo.company,
          last_message: msgs[0].content,
          last_message_time: msgs[0].created_at,
          unread_count: unreadCount,
          calendly_link: userInfo.calendly_link,
          messages: sortedMsgs.map(m => ({
            id: m.id,
            sender: m.sender_user_id === currentUserId ? "self" as const : "other" as const,
            content: m.content,
            timestamp: m.created_at,
          })),
        };
      });

      const resolvedThreads = await Promise.all(threadPromises);

      // Sort threads by last message time
      resolvedThreads.sort((a, b) =>
        new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
      );

      setThreads(resolvedThreads);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    */
  }, [currentUserId, userType, toast]);

  const sendMessage = useCallback(async (receiverUserId: string, content: string) => {
    // DISCONNECTED: API calls disabled - simulating success
    if (!currentUserId || !content.trim()) return false;

    toast({
      title: "Demo Mode",
      description: "Message sending is disabled in demo mode",
    });
    return false;

    /* ORIGINAL API CALLS - DISCONNECTED
    try {
      const { error } = await supabase.from("messages").insert({
        sender_user_id: currentUserId,
        receiver_user_id: receiverUserId,
        content: content.trim(),
      });

      if (error) throw error;

      // Refresh threads to show new message
      await fetchThreads();
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return false;
    }
    */
  }, [currentUserId, fetchThreads, toast]);

  const markAsRead = useCallback(async (otherUserId: string) => {
    // DISCONNECTED: API calls disabled
    return;

    /* ORIGINAL API CALLS - DISCONNECTED
    if (!currentUserId) return;

    try {
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("sender_user_id", otherUserId)
        .eq("receiver_user_id", currentUserId)
        .eq("read", false);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
    */
  }, [currentUserId]);

  // DISCONNECTED: Realtime subscription disabled
  useEffect(() => {
    // Real-time subscriptions disabled in demo mode
    return;

    /* ORIGINAL REALTIME SUBSCRIPTION - DISCONNECTED
    if (!currentUserId) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_user_id=eq.${currentUserId}`,
        },
        () => {
          fetchThreads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    */
  }, [currentUserId, fetchThreads]);

  return {
    threads,
    loading,
    fetchThreads,
    sendMessage,
    markAsRead,
  };
}
