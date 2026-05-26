-- Fix: appointments public SELECT exposes all rows. Drop the broken policy.
-- Token-based lookups will be moved to a dedicated edge function (get-appointment-by-token)
-- using service role with the token passed as a parameter.
DROP POLICY IF EXISTS "Allow public access via access_token" ON public.appointments;

-- Fix: site_config exposed publicly (contains webpushr keys). Restrict reads to authenticated users only.
DROP POLICY IF EXISTS "Public can view config" ON public.site_config;
REVOKE SELECT ON public.site_config FROM anon;
