-- Create messages table for in-app messaging
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_user_id UUID NOT NULL,
  receiver_user_id UUID NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
CREATE POLICY "Users can view their own messages"
ON public.messages
FOR SELECT
USING (auth.uid() = sender_user_id OR auth.uid() = receiver_user_id);

-- Users can send messages
CREATE POLICY "Users can send messages"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = sender_user_id);

-- Users can mark their received messages as read
CREATE POLICY "Users can update their received messages"
ON public.messages
FOR UPDATE
USING (auth.uid() = receiver_user_id);

-- Add calendly_link to founder_applications
ALTER TABLE public.founder_applications 
ADD COLUMN calendly_link TEXT;

-- Add calendly_link to investor_applications
ALTER TABLE public.investor_applications 
ADD COLUMN calendly_link TEXT;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;