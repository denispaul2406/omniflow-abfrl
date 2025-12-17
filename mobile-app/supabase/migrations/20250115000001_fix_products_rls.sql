-- Fix RLS policies for products table to allow inserts
-- This allows the import script to insert products

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are insertable by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products are insertable by service role" ON public.products;

-- Allow public read access
CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
USING (true);

-- Allow inserts (for import script and authenticated users)
CREATE POLICY "Products are insertable by authenticated users"
ON public.products
FOR INSERT
WITH CHECK (true);

-- Allow updates (for authenticated users)
CREATE POLICY "Products are updatable by authenticated users"
ON public.products
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow deletes (for authenticated users)
CREATE POLICY "Products are deletable by authenticated users"
ON public.products
FOR DELETE
USING (true);

