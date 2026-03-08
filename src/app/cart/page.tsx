'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { applyPromoCode, PromoCode } from '@/lib/promoCodes';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput, total);
    if ('error' in result) {
      setPromoError(result.error);
      setPromoSuccess('');
      setAppliedPromo(null);
      setPromoDiscount(0);
    } else {
      setAppliedPromo(result.promo);
      setPromoDiscount(result.discount);
      setPromoError('');
      setPromoSuccess(`Kode "${result.promo.code}" berhasil diterapkan! Hemat ${formatPrice(result.discount)}`);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoInput('');
    setPromoError('');
    setPromoSuccess('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-700 mb-2">Keranjang Anda kosong</h2>
          <p className="text-stone-500 mb-8">
            Sepertinya Anda belum menambahkan produk apapun. Yuk mulai eksplorasi!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-900 text-white font-semibold px-7 py-3 rounded-xl hover:bg-blue-950 transition-colors"
          >
            Jelajahi Produk <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = total >= 500000 ? 0 : 15000;
  const finalTotal = total - promoDiscount + shipping;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Keranjang Belanja</h1>
        <p className="text-stone-500 mb-8">
          {itemCount} item di keranjang Anda
        </p>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3 mb-8 lg:mb-0">
            {items.map((item) => (
              <div
                key={`${item.product_id}-${item.size}`}
                className="bg-white rounded-2xl border border-stone-100 p-4 flex gap-4"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.product_id}`}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-50 shrink-0"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.product_id}`}>
                      <h3 className="font-semibold text-stone-800 hover:text-blue-900 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeItem(item.product_id, item.size)}
                      className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-1.5 mb-3">
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      Ukuran: {item.size}
                    </span>
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      Kondisi: {item.condition}/10
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.size, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-50 rounded-l-lg disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-50 rounded-r-lg disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-blue-900 text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" /> Lanjut Belanja
            </Link>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-stone-800 mb-5">Ringkasan Pesanan</h2>

              {/* Promo code input */}
              <div className="mb-5">
                <p className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-800" /> Kode Promo
                </p>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <div>
                      <span className="text-sm font-bold text-green-700">{appliedPromo.code}</span>
                      <p className="text-xs text-green-600">{appliedPromo.description}</p>
                    </div>
                    <button onClick={handleRemovePromo} className="p-1 text-green-600 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                        placeholder="Masukkan kode promo"
                        className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-xl focus:border-blue-600 outline-none bg-white"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={!promoInput.trim()}
                        className="px-4 py-2 text-sm font-semibold bg-blue-900 text-white rounded-xl hover:bg-blue-950 disabled:opacity-40 transition-colors"
                      >
                        Pakai
                      </button>
                    </div>
                    {promoError && <p className="text-xs text-red-500 mt-1.5">{promoError}</p>}
                    {promoSuccess && <p className="text-xs text-green-600 mt-1.5">{promoSuccess}</p>}
                  </>
                )}
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal ({itemCount} item)</span>
                  <span className="font-medium text-stone-800">{formatPrice(total)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Diskon ({appliedPromo?.code})</span>
                    <span className="font-medium text-green-600">−{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Ongkos Kirim</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-stone-800'}`}>
                    {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-stone-500 bg-blue-50 p-2 rounded-lg">
                    Tambah {formatPrice(500000 - total)} lagi untuk gratis ongkir!
                  </p>
                )}
              </div>

              <div className="border-t border-stone-100 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="font-bold text-stone-800">Total</span>
                  <span className="font-bold text-xl text-blue-900">{formatPrice(finalTotal)}</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">Termasuk pajak bila berlaku</p>
              </div>

              <Link
                href={`/checkout?discount=${promoDiscount}&promo=${appliedPromo?.code ?? ''}`}
                className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-950 transition-all active:scale-95"
              >
                Lanjut ke Pembayaran <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Payment methods */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-500 text-center mb-3">Metode Pembayaran Diterima</p>
                <div className="flex justify-center gap-3 text-xs text-stone-600">
                  <span className="bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">🏦 Transfer Bank</span>
                  <span className="bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">📱 Dompet Digital</span>
                  <span className="bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">💵 COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
