-- Extend products table with rich data fields from JSON
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS product_code TEXT,
ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS fit TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS occasion TEXT,
ADD COLUMN IF NOT EXISTS pattern TEXT,
ADD COLUMN IF NOT EXISTS collection TEXT,
ADD COLUMN IF NOT EXISTS product_type TEXT,
ADD COLUMN IF NOT EXISTS subbrand TEXT,
ADD COLUMN IF NOT EXISTS style_code TEXT,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS aisle TEXT,
ADD COLUMN IF NOT EXISTS stock_store JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS sizes_data JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS coupons_data JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS image_source TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products(product_type);

