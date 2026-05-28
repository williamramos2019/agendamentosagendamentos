
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO anon, authenticated;
GRANT ALL ON public.appointments TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO anon, authenticated;
GRANT ALL ON public.sales TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cash_operations TO anon, authenticated;
GRANT ALL ON public.cash_operations TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO anon, authenticated;
GRANT ALL ON public.notifications TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.neighborhoods TO anon, authenticated;
GRANT ALL ON public.neighborhoods TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_config TO anon, authenticated;
GRANT ALL ON public.site_config TO service_role;

GRANT SELECT, INSERT ON public.site_visits TO anon, authenticated;
GRANT ALL ON public.site_visits TO service_role;
