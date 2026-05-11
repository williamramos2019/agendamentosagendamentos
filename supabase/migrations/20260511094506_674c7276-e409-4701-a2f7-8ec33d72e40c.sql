CREATE TABLE public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  source_category TEXT NOT NULL DEFAULT 'direct',
  source_name TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_visits_created_at ON public.site_visits(created_at DESC);
CREATE INDEX idx_site_visits_session ON public.site_visits(session_id);
CREATE INDEX idx_site_visits_source ON public.site_visits(source_category);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits"
  ON public.site_visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read visits"
  ON public.site_visits FOR SELECT
  USING (true);