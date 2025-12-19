-- Add sync_note field to connection_requests table for 60 word message
ALTER TABLE public.connection_requests 
ADD COLUMN sync_note TEXT CHECK (char_length(sync_note) <= 500);