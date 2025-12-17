export interface User {
  id: string;
  name: string;
  age: number | null;
  style_preference: string | null;
  favorite_brands: string[] | null;
  size: string | null;
  loyalty_points: number;
  loyalty_tier: string;
  avatar_url: string | null;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string | null;
  size: string[] | null;
  stock_count: number;
  // Extended fields from JSON data
  product_code?: string | null;
  discount_price?: number | null;
  discount_percent?: number | null;
  description?: string | null;
  material?: string | null;
  fit?: string | null;
  color?: string | null;
  occasion?: string | null;
  pattern?: string | null;
  collection?: string | null;
  product_type?: string | null;
  subbrand?: string | null;
  style_code?: string | null;
  rating?: number | null;
  reviews?: number | null;
  aisle?: string | null;
  stock_store?: Record<string, number> | null;
  sizes_data?: Array<{
    size: string;
    available?: boolean;
    measurements?: Record<string, number>;
    stock_level?: string;
  }> | null;
  coupons_data?: Array<{
    code: string;
    discount?: number;
    discount_percent?: number;
    min_purchase?: number;
    description?: string;
  }> | null;
  image_source?: string | null;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  session_id: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  discount_applied: number;
  order_status: string;
  session_id: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  products?: Product[];
  timestamp: Date;
}
