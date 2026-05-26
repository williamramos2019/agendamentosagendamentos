-- Secure the site_visits table
-- First, drop the overly permissive policies if they exist
DROP POLICY IF EXISTS "Anyone can insert visits" ON public.site_visits;
DROP POLICY IF EXISTS "Anyone can read visits" ON public.site_visits;

-- 1. Anyone can insert visits (required for tracking anonymous users)
CREATE POLICY "Public can insert visits"
ON public.site_visits
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Only authenticated admins can view analytics
-- Since we use a custom admin login (localStorage/sessionStorage), 
-- if we want real Supabase security we should use Supabase Auth.
-- But for now, let's at least restrict SELECT to the service_role or authenticated.
-- If the project doesn't use Supabase Auth yet, we can't use auth.uid().
-- For now, let's keep it restricted to service_role and authenticated roles.
CREATE POLICY "Admins can view visits"
ON public.site_visits
FOR SELECT
TO authenticated
USING (true);

-- Grant access to service_role always
GRANT ALL ON public.site_visits TO service_role;
GRANT INSERT ON public.site_visits TO anon;
GRANT SELECT, INSERT ON public.site_visits TO authenticated;
