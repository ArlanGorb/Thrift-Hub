-- ============================================================
-- THRIFT HUB - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('T-Shirts', 'Hoodies', 'Jackets', 'Sweaters', 'Vintage Clothing', 'Jeans')),
  size TEXT NOT NULL,
  condition INTEGER NOT NULL CHECK (condition BETWEEN 1 AND 10),
  description TEXT,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  stock INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can view products
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- Only admins can modify products
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'e_wallet', 'cash_on_delivery')),
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update order status
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  size TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );

CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only delete their own reviews
CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- WISHLIST TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- SEED DATA: Sample products
-- ============================================================
INSERT INTO public.products (name, price, category, size, condition, description, image, images, stock, is_featured, is_best_seller) VALUES
('Vintage Denim Jacket', 45.00, 'Jackets', 'M', 9, 'Classic 90s denim jacket in excellent condition. Minimal wear, all buttons intact. Perfect for layering a casual or vintage-inspired outfit.', 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600', ARRAY['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600'], 5, TRUE, TRUE),
('Classic White Tee', 12.00, 'T-Shirts', 'L', 8, 'Simple, clean white t-shirt. Slightly worn but still in great shape. Fits true to size. A wardrobe essential.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'], 10, TRUE, FALSE),
('Cozy Knit Sweater', 28.00, 'Sweaters', 'S', 9, 'Soft beige knit sweater, warm and comfortable. Barely worn with no pills. Great for fall and winter.', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], 3, TRUE, FALSE),
('Streetwear Hoodie', 35.00, 'Hoodies', 'XL', 8, 'Urban streetwear hoodie with a relaxed fit. Front kangaroo pocket, drawstring hood. Light fading gives it that authentic vintage look.', 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'], 4, TRUE, TRUE),
('Retro 70s Shirt', 22.00, 'Vintage Clothing', 'M', 7, 'Funky 70s-inspired collared shirt with a bold pattern. Authentic vintage piece from the era. Some light fading.', 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600', ARRAY['https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600'], 2, FALSE, FALSE),
('Slim Fit Jeans', 30.00, 'Jeans', '32', 8, 'Dark wash slim fit jeans. Comfortable stretch denim. Light knee wear. Great everyday jeans.', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600', ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600'], 6, FALSE, TRUE),
('Oversized Flannel Shirt', 18.00, 'Vintage Clothing', 'L', 8, 'Classic plaid flannel shirt in an oversized cut. Warm and stylish. Great for layering.', 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600', ARRAY['https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600'], 7, FALSE, TRUE),
('Vintage Windbreaker', 40.00, 'Jackets', 'S', 9, '90s vintage windbreaker in excellent condition. Vibrant colors, full zip, elastic cuffs. A true era piece.', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'], 2, TRUE, FALSE),
('Band Graphic Tee', 15.00, 'T-Shirts', 'M', 7, 'Vintage band graphic tee with faded print. Authentic wear adds to the charm. 100% cotton.', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600', ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600'], 8, FALSE, FALSE),
('Cargo Jogger Pants', 25.00, 'Jeans', '30', 8, 'Relaxed cargo jogger pants with multiple pockets. Comfortable and functional streetwear.', 'https://images.unsplash.com/photo-1594938298603-c8148c4bef28?w=600', ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4bef28?w=600'], 5, FALSE, FALSE),
('Wool Blend Coat', 55.00, 'Jackets', 'M', 9, 'Premium wool blend overcoat in charcoal grey. Barely worn, no damage. Classic silhouette that never goes out of style.', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600', ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600'], 1, TRUE, FALSE),
('Pullover Crewneck', 20.00, 'Sweaters', 'XL', 8, 'Simple crewneck pullover sweatshirt. Soft fleece interior, minimal branding. Great everyday wear.', 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600', ARRAY['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600'], 9, FALSE, TRUE);

-- Sample reviews (using dummy UUIDs for user_id)
INSERT INTO public.reviews (product_id, user_id, user_name, rating, comment)
SELECT 
  p.id,
  NULL,
  'Sarah K.',
  5,
  'Absolutely love this piece! The quality is amazing for the price. Will definitely shop here again.'
FROM public.products p WHERE p.name = 'Vintage Denim Jacket' LIMIT 1;

INSERT INTO public.reviews (product_id, user_id, user_name, rating, comment)
SELECT 
  p.id,
  NULL,
  'James T.',
  4,
  'Great condition as described. Fast shipping too. Very happy with my purchase.'
FROM public.products p WHERE p.name = 'Vintage Denim Jacket' LIMIT 1;

INSERT INTO public.reviews (product_id, user_id, user_name, rating, comment)
SELECT 
  p.id,
  NULL,
  'Aisha M.',
  5,
  'Perfect fit and exactly as described. Sustainable shopping at its best!'
FROM public.products p WHERE p.name = 'Streetwear Hoodie' LIMIT 1;
