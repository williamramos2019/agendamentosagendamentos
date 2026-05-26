-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Appointments Table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_address TEXT,
    services JSONB NOT NULL DEFAULT '[]',
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    employee TEXT,
    duration INTEGER DEFAULT 60,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Sales Table
CREATE TABLE public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    items JSONB NOT NULL DEFAULT '[]',
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'credit', 'debit', 'pix')),
    type TEXT NOT NULL DEFAULT 'service' CHECK (type IN ('service', 'product')),
    client_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Cash Operations Table
CREATE TABLE public.cash_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('sale', 'withdrawal', 'deposit', 'expense')),
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    time TEXT NOT NULL,
    sale_id UUID REFERENCES public.sales(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Leads Table
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    source TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Blog Posts Table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Site Config Table
CREATE TABLE public.site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Neighborhoods Table (SEO)
CREATE TABLE public.neighborhoods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    seo_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- GRANTS
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT INSERT ON public.appointments TO anon;
GRANT INSERT ON public.leads TO anon;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.neighborhoods TO anon;
GRANT SELECT ON public.site_config TO anon;

-- ENABLE RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Appointments: Public can insert, Admins (authenticated) can do everything
CREATE POLICY "Public can create appointments" ON public.appointments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL TO authenticated USING (true);

-- Sales & Cash: Admins only
CREATE POLICY "Admins can manage sales" ON public.sales FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage cash" ON public.cash_operations FOR ALL TO authenticated USING (true);

-- Leads: Public can insert, Admins manage
CREATE POLICY "Public can create leads" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL TO authenticated USING (true);

-- Blog: Anyone can read, Admins manage
CREATE POLICY "Public can view blog posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (true);

-- Config: Anyone can read, Admins manage
CREATE POLICY "Public can view config" ON public.site_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage config" ON public.site_config FOR ALL TO authenticated USING (true);

-- Neighborhoods: Anyone can read, Admins manage
CREATE POLICY "Public can view neighborhoods" ON public.neighborhoods FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage neighborhoods" ON public.neighborhoods FOR ALL TO authenticated USING (true);

-- INDEXES
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_sales_created_at ON public.sales(created_at);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_neighborhoods_slug ON public.neighborhoods(slug);
