// ============================================================
// THRIFT HUB - Shared TypeScript Types
// ============================================================

export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type ProductCategory =
  | 'T-Shirts'
  | 'Hoodies'
  | 'Jackets'
  | 'Sweaters'
  | 'Vintage Clothing'
  | 'Jeans';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'T-Shirts',
  'Hoodies',
  'Jackets',
  'Sweaters',
  'Vintage Clothing',
  'Jeans',
];

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  size: string;
  available_sizes?: string[];
  condition: number; // 1-10
  description?: string;
  image: string;
  images?: string[];
  stock: number;
  is_featured?: boolean;
  is_best_seller?: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export type PaymentMethod = 'bank_transfer' | 'e_wallet' | 'cash_on_delivery';

export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: PaymentMethod;
  total_price: number;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  size?: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  user_name: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

// Cart types (stored in localStorage)
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  condition: number;
  quantity: number;
  stock: number;
}

// Filter types for product catalog
export interface ProductFilters {
  category?: ProductCategory | '';
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Form types
export interface CheckoutForm {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ProductForm {
  name: string;
  price: number;
  category: ProductCategory;
  size: string;
  condition: number;
  description: string;
  image: string;
  stock: number;
  is_featured: boolean;
  is_best_seller: boolean;
}
