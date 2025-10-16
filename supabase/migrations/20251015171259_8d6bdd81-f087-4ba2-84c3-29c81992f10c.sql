-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price REAL NOT NULL,
  tags TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Interactions table
CREATE TABLE IF NOT EXISTS public.interactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_value REAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Recommendation logs table
CREATE TABLE IF NOT EXISTS public.rec_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  score REAL NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_rec_user FOREIGN KEY(user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_rec_product FOREIGN KEY(product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rec_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for products (this is a demo, so products are publicly viewable)
CREATE POLICY "Public products read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public products insert access" ON public.products FOR INSERT WITH CHECK (true);

-- Public access for users (demo purposes)
CREATE POLICY "Public users access" ON public.users FOR ALL USING (true);

-- Public access for interactions (demo purposes)
CREATE POLICY "Public interactions access" ON public.interactions FOR ALL USING (true);

-- Public access for rec_logs (demo purposes)
CREATE POLICY "Public rec_logs access" ON public.rec_logs FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interactions_user ON public.interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_product ON public.interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_rec_logs_user ON public.rec_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);