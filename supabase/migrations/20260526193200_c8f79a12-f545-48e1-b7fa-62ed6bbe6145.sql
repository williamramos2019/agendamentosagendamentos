-- 1. REFORÇO DE RLS EM TODAS AS TABELAS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. LIMPEZA DE POLÍTICAS EXISTENTES (HARD RESET PARA SEGURANÇA)
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 3. DEFINIÇÃO DE POLÍTICAS DE PRIVILÉGIO MÍNIMO

-- Notifications (Admin Only)
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL TO authenticated USING (true);

-- Site Visits (Public insert, Admin read)
CREATE POLICY "Anyone can insert visits" ON public.site_visits FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view visits" ON public.site_visits FOR SELECT TO authenticated USING (true);

-- Appointments (Public create, Admin manage, NO public read)
CREATE POLICY "Public can create appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL TO authenticated USING (true);
-- Nota: Visitantes leem via Edge Function 'get-appointment-by-token' que usa service_role.

-- Sales & Cash (Admin ONLY)
CREATE POLICY "Admins can manage sales" ON public.sales FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage cash" ON public.cash_operations FOR ALL TO authenticated USING (true);

-- Leads (Public create, Admin manage)
CREATE POLICY "Public can create leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL TO authenticated USING (true);

-- Blog & Neighborhoods (Public read, Admin manage)
CREATE POLICY "Public can view blog posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view neighborhoods" ON public.neighborhoods FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage neighborhoods" ON public.neighborhoods FOR ALL TO authenticated USING (true);

-- Config (Admin only for security - contains API keys)
CREATE POLICY "Admins can manage config" ON public.site_config FOR ALL TO authenticated USING (true);

-- 4. RESTRINÇÃO DE GRANTS (DATA API HARDENING)
-- Revogar tudo primeiro
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

-- Grants para Anônimos (Visitantes)
GRANT INSERT ON public.appointments TO anon;
GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.site_visits TO anon;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.neighborhoods TO anon;

-- Grants para Autenticados (Admins via Supabase Auth)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grants para Service Role (Sempre Total)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 5. OTIMIZAÇÃO E CONSTRAINTS DE DADOS
-- Garantir que preços e totais não sejam negativos
ALTER TABLE public.sales ADD CONSTRAINT sales_total_positive CHECK (total >= 0);
ALTER TABLE public.cash_operations ADD CONSTRAINT cash_amount_check CHECK (amount <> 0);

-- Adicionar índices de performance se não existirem
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);
