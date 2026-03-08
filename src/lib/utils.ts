import { OrderStatus, PaymentMethod } from './types';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getConditionLabel(condition: number): string {
  if (condition >= 9) return 'Seperti Baru';
  if (condition >= 7) return 'Bagus';
  if (condition >= 5) return 'Baik';
  if (condition >= 3) return 'Cukup';
  return 'Lusuh';
}

export function getConditionColor(condition: number): string {
  if (condition >= 9) return 'text-green-600 bg-green-50';
  if (condition >= 7) return 'text-blue-600 bg-blue-50';
  if (condition >= 5) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return labels[status] ?? status;
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    bank_transfer: 'Transfer Bank',
    e_wallet: 'Dompet Digital',
    cash_on_delivery: 'Bayar di Tempat',
  };
  return labels[method];
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TH-${timestamp}-${random}`;
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    key &&
    url !== 'https://your-project-id.supabase.co' &&
    key !== 'your-anon-key-here'
  );
}
