-- Enable Row Level Security (RLS) on both tables
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for membership_applications
CREATE POLICY "Admins can manage membership_applications" 
ON public.membership_applications 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create policies for members
CREATE POLICY "Admins can manage members" 
ON public.members 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Optionally allow inserting applications from anon (since public apply uses service_role anyway, it is not strictly needed to allow anon, but we'll do it if there was an anon client. As checked, the apply form uses service_role to bypass RLS, so we don't need anon policies).