-- 1. Controle de Acesso (Roles)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 2. Atualização Blog Posts
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS icon_name VARCHAR(50),
  ADD COLUMN IF NOT EXISTS read_minutes INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS published_at DATE,
  ADD COLUMN IF NOT EXISTS service_id VARCHAR(100),
  ADD COLUMN IF NOT EXISTS related JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS meta_seo JSONB DEFAULT '{}'::jsonb;

-- 3. Atualização Appointments
ALTER TABLE public.appointments 
  ADD COLUMN IF NOT EXISTS distance_km DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS visitor_id VARCHAR(64);

-- 4. Atualização Neighborhoods
ALTER TABLE public.neighborhoods 
  ADD COLUMN IF NOT EXISTS city_slug VARCHAR(255),
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

-- 5. Site Config (Garantir estrutura key-value simple se necessário)
-- A tabela site_config já existe, garantimos grants.
GRANT SELECT ON public.site_config TO anon;
GRANT SELECT ON public.site_config TO authenticated;
GRANT ALL ON public.site_config TO service_role;

-- 6. Políticas RLS Revisitadas
-- Blog: Público lê, Admin gerencia
DROP POLICY IF EXISTS "Public can view blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Public can view blog posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Appointments: Público cria e vê via token (ou admin)
DROP POLICY IF EXISTS "Public can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can manage appointments" ON public.appointments;
CREATE POLICY "Public can create appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Neighborhoods: Público lê, Admin gerencia
DROP POLICY IF EXISTS "Public can view neighborhoods" ON public.neighborhoods;
DROP POLICY IF EXISTS "Admins can manage neighborhoods" ON public.neighborhoods;
CREATE POLICY "Public can view neighborhoods" ON public.neighborhoods FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage neighborhoods" ON public.neighborhoods FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Site Config: Admin gerencia
DROP POLICY IF EXISTS "Admins can manage config" ON public.site_config;
CREATE POLICY "Admins can manage config" ON public.site_config FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User Roles: Admin gerencia, usuário vê a sua
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 7. Seed Inicial de Configuração
INSERT INTO public.site_config (config_key, config_value) 
VALUES 
  ('whatsapp', '"5531980252882"'),
  ('business_name', '"Auto Limpeza Pro"'),
  ('primary_color', '"#0EA5FF"'),
  ('address', '"São José da Lapa, MG"')
ON CONFLICT (config_key) DO NOTHING;

-- Grants Gerais (Garantir que PostgREST tenha acesso)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
