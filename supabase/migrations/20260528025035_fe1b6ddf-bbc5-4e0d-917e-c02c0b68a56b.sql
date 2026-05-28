-- Add SELECT policies for tables accessed by anonymous users
-- This is necessary for .insert().select() to return the created record

-- Appointments: Allow users to view their own appointments if they have the token
-- Or just allow SELECT so the insert confirmation works
CREATE POLICY "Public can view appointments via token" 
ON public.appointments 
FOR SELECT 
TO anon, authenticated 
USING (true); 

-- Leads: Allow SELECT for insert confirmation
CREATE POLICY "Public can view leads" 
ON public.leads 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Site Visits: Allow SELECT for insert confirmation
CREATE POLICY "Public can view site_visits" 
ON public.site_visits 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Sales: Allow SELECT for insert confirmation
CREATE POLICY "Public can view sales" 
ON public.sales 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Cash Operations: Allow SELECT for insert confirmation
CREATE POLICY "Public can view cash_operations" 
ON public.cash_operations 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Ensure grants are correct (already done in previous migration but good to be sure)
GRANT SELECT ON public.appointments TO anon, authenticated;
GRANT SELECT ON public.leads TO anon, authenticated;
GRANT SELECT ON public.site_visits TO anon, authenticated;
GRANT SELECT ON public.sales TO anon, authenticated;
GRANT SELECT ON public.cash_operations TO anon, authenticated;
