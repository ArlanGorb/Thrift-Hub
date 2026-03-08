'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Truck, Smartphone, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, generateOrderId } from '@/lib/utils';
import { CheckoutForm, PaymentMethod, Order, OrderItem } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    value: 'bank_transfer',
    label: 'Transfer Bank',
    icon: <CreditCard className="w-5 h-5" />,
    desc: 'Transfer ke rekening bank kami dan unggah bukti pembayaran.',
  },
  {
    value: 'e_wallet',
    label: 'Dompet Digital',
    icon: <Smartphone className="w-5 h-5" />,
    desc: 'Bayar melalui GoPay, OVO, atau Dana.',
  },
  {
    value: 'cash_on_delivery',
    label: 'Bayar di Tempat',
    icon: <Truck className="w-5 h-5" />,
    desc: 'Bayar tunai saat paket tiba di tangan Anda.',
  },
];

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const promoDiscount = parseInt(searchParams.get('discount') ?? '0', 10) || 0;
  const promoCode = searchParams.get('promo') ?? '';

  const [form, setForm] = useState<CheckoutForm>({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    shipping_address: user?.address || '',
    payment_method: 'e_wallet',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [submitting, setSubmitting] = useState(false);

  const shipping = total >= 500000 ? 0 : 15000;
  const finalTotal = total - promoDiscount + shipping;

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};
    if (!form.customer_name.trim()) newErrors.customer_name = 'Nama wajib diisi';
    if (!form.customer_email.trim()) newErrors.customer_email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email))
      newErrors.customer_email = 'Alamat email tidak valid';
    if (!form.customer_phone.trim()) newErrors.customer_phone = 'Nomor telepon wajib diisi';
    if (!form.shipping_address.trim()) newErrors.shipping_address = 'Alamat wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    setSubmitting(true);

    // Simulate API latency
    await new Promise((r) => setTimeout(r, 1000));

    const orderId = generateOrderId();
    const orderItems: OrderItem[] = items.map((item) => ({
      id: uuidv4(),
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      created_at: new Date().toISOString(),
    }));

    const order: Order = {
      id: orderId,
      user_id: user?.id,
      ...form,
      total_price: finalTotal,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: orderItems,
    };

    // Persist order in localStorage for demo
    try {
      const existing = JSON.parse(localStorage.getItem('thrift_hub_orders') || '[]');
      localStorage.setItem('thrift_hub_orders', JSON.stringify([order, ...existing]));
    } catch {
      // ignore
    }

    clearCart();
    router.push(`/checkout/confirmation?orderId=${orderId}`);
  };

  const update = (field: keyof CheckoutForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  if (items.length === 0 && typeof window !== 'undefined') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Keranjang Anda kosong.</p>
          <Link href="/products" className="text-blue-900 font-semibold hover:underline">
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Keranjang
        </Link>

        <h1 className="text-3xl font-bold text-stone-800 mb-8">Pembayaran</h1>

        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6 mb-8 lg:mb-0">
              {/* Contact info */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-lg font-bold text-stone-800 mb-5">Informasi Kontak</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={(e) => update('customer_name', e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white transition-colors ${
                        errors.customer_name ? 'border-red-400' : 'border-stone-200 focus:border-blue-600'
                      }`}
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={(e) => update('customer_email', e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white transition-colors ${
                        errors.customer_email ? 'border-red-400' : 'border-stone-200 focus:border-blue-600'
                      }`}
                    />
                    {errors.customer_email && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      value={form.customer_phone}
                      onChange={(e) => update('customer_phone', e.target.value)}
                      placeholder="08xx-xxxx-xxxx"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white transition-colors ${
                        errors.customer_phone ? 'border-red-400' : 'border-stone-200 focus:border-blue-600'
                      }`}
                    />
                    {errors.customer_phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-lg font-bold text-stone-800 mb-5">Alamat Pengiriman</h2>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={form.shipping_address}
                    onChange={(e) => update('shipping_address', e.target.value)}
                    placeholder="Jalan, Kota, Provinsi, Kode Pos"
                    rows={3}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm resize-none bg-white transition-colors ${
                      errors.shipping_address ? 'border-red-400' : 'border-stone-200 focus:border-blue-600'
                    }`}
                  />
                  {errors.shipping_address && (
                    <p className="text-red-500 text-xs mt-1">{errors.shipping_address}</p>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Catatan Pesanan (opsional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    placeholder="Instruksi khusus..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm resize-none bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-lg font-bold text-stone-800 mb-5">Metode Pembayaran</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        form.payment_method === method.value
                          ? 'border-blue-800 bg-blue-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={form.payment_method === method.value}
                        onChange={() => update('payment_method', method.value)}
                        className="mt-0.5 accent-blue-800"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-900">{method.icon}</span>
                          <span className="font-semibold text-stone-800">{method.label}</span>
                        </div>
                        <p className="text-sm text-stone-500 mt-0.5">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-stone-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-stone-800 mb-5">Ringkasan Pesanan</h2>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.product_id}-${item.size}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-50 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                        <p className="text-xs text-stone-500">Ukuran {item.size} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-stone-800 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Diskon ({promoCode})</span>
                      <span className="font-medium text-green-600">−{formatPrice(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Ongkos Kirim</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-stone-800">Total</span>
                    <span className="font-bold text-xl text-blue-900">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-950 disabled:opacity-50 transition-all active:scale-95"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Buat Pesanan
                    </>
                  )}
                </button>

                <p className="text-xs text-stone-400 text-center mt-3">
                  Detail pesanan Anda aman dan terenkripsi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
