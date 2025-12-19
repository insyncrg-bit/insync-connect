-- Create connection_requests table to track interests, syncs, and pending
CREATE TABLE public.connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_user_id UUID NOT NULL,
  requester_type TEXT NOT NULL CHECK (requester_type IN ('founder', 'investor')),
  target_user_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('founder', 'investor')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_connection_request UNIQUE (requester_user_id, target_user_id)
);

-- Enable RLS
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;

-- Users can view connection requests where they are the requester or target
CREATE POLICY "Users can view their own connection requests"
ON public.connection_requests
FOR SELECT
USING (auth.uid() = requester_user_id OR auth.uid() = target_user_id);

-- Users can create connection requests as the requester
CREATE POLICY "Users can create connection requests"
ON public.connection_requests
FOR INSERT
WITH CHECK (auth.uid() = requester_user_id);

-- Users can update connection requests where they are the target (to accept/decline)
CREATE POLICY "Target users can update connection requests"
ON public.connection_requests
FOR UPDATE
USING (auth.uid() = target_user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_connection_requests_updated_at
BEFORE UPDATE ON public.connection_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for connection_requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_requests;