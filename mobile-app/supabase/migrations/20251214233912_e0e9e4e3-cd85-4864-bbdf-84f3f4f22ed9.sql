-- Create users table for customer profiles
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER,
  style_preference TEXT,
  favorite_brands TEXT[],
  size TEXT,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Bronze',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  size TEXT[],
  stock_count INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cart table
CREATE TABLE public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_applied DECIMAL(10,2) DEFAULT 0,
  order_status TEXT DEFAULT 'pending',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table for order details
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (this is a demo app with hardcoded users)
CREATE POLICY "Allow public read access on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cart" ON public.cart FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cart" ON public.cart FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cart" ON public.cart FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on cart" ON public.cart FOR DELETE USING (true);
CREATE POLICY "Allow public read access on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Insert hardcoded user personas
INSERT INTO public.users (id, name, age, style_preference, favorite_brands, size, loyalty_points, loyalty_tier, avatar_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Aarav Kumar', 22, 'Casual & Trendy', ARRAY['Bewakoof', 'The Souled Store'], 'M', 500, 'Silver', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'),
('22222222-2222-2222-2222-222222222222', 'Rohan Mehta', 35, 'Professional & Classic', ARRAY['Van Heusen', 'Louis Philippe'], '40 Slim', 0, 'Bronze', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan'),
('33333333-3333-3333-3333-333333333333', 'Priya Sharma', 28, 'Premium & Elegant', ARRAY['Allen Solly', 'Pantaloons'], 'M', 2500, 'Gold', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya');

-- Insert sample products
INSERT INTO public.products (brand, name, price, image_url, category, size, stock_count) VALUES
('Bewakoof', 'Oversized Graphic Tee - Urban Vibes', 799, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'T-Shirts', ARRAY['S', 'M', 'L', 'XL'], 50),
('Bewakoof', 'Cargo Joggers - Street Style', 1299, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', 'Pants', ARRAY['S', 'M', 'L', 'XL'], 35),
('Van Heusen', 'Classic Fit Formal Shirt', 2499, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', 'Shirts', ARRAY['38', '40', '42', '44'], 40),
('Van Heusen', 'Slim Fit Formal Trousers', 2999, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', 'Pants', ARRAY['30', '32', '34', '36', '38', '40'], 45),
('Allen Solly', 'Premium Cotton Blazer', 5999, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 'Blazers', ARRAY['S', 'M', 'L', 'XL'], 25),
('Allen Solly', 'Elegant A-Line Dress', 3499, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 'Dresses', ARRAY['XS', 'S', 'M', 'L'], 30),
('Louis Philippe', 'Premium Linen Shirt', 3299, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400', 'Shirts', ARRAY['38', '40', '42', '44'], 40),
('The Souled Store', 'Anime Print Hoodie', 1899, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 'Hoodies', ARRAY['S', 'M', 'L', 'XL', 'XXL'], 60),
('Pantaloons', 'Ethnic Kurta Set', 2799, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 'Ethnic', ARRAY['S', 'M', 'L', 'XL'], 35),
('Pantaloons', 'Designer Saree', 4999, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 'Ethnic', ARRAY['Free Size'], 20);