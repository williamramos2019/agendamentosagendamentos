-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

-- Policies
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Seed site_config for Webpushr if not exists
INSERT INTO public.site_config (config_key, config_value)
VALUES 
  ('webpushr_key', '"YOUR_WEBPUSHR_KEY"'),
  ('webpushr_auth_token', '"YOUR_WEBPUSHR_AUTH_TOKEN"')
ON CONFLICT (config_key) DO NOTHING;
