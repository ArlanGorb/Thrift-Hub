'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronDown, ChevronUp, ShoppingBag, Star, CheckCircle2, Archive, ArchiveRestore } from 'lucide-react';
import { Order, OrderItem, Review } from '@/lib/types';
import { MOCK_ORDERS } from '@/lib/mockData';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders] = useState<Order[]>(() => {
    if (typeof window === 'undefined') return MOCK_ORDERS;
    try {
      const stored = JSON.parse(localStorage.getItem('thrift_hub_orders') || '[]') as Order[];
      // Only include mock orders that belong to the current demo user
      const mockForUser = MOCK_ORDERS.filter((o) => !user || o.user_id === user.id);
      // Deduplicate: stored orders take priority over mock orders
      const storedIds = new Set(stored.map((o) => o.id));
      const merged = [...stored, ...mockForUser.filter((o) => !storedIds.has(o.id))];
      return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch {
      return MOCK_ORDERS;
    }
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const ARCHIVE_KEY = 'thrift_hub_archived_orders';
  const [archivedIds, setArchivedIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]') as string[];
      return new Set(stored);
    } catch { return new Set(); }
  });

  const handleArchive = (orderId: string) => {
    setArchivedIds((prev) => {
      const next = new Set([...prev, orderId]);
      try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
    if (expanded === orderId) setExpanded(null);
    toast.success('Pesanan diarsipkan');
  };

  const handleUnarchive = (orderId: string) => {
    setArchivedIds((prev) => {
      const next = new Set([...prev]);
      next.delete(orderId);
      try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
    toast.success('Pesanan dipindahkan ke Pesanan Aktif');
  };

  const activeOrders = orders.filter((o) => !archivedIds.has(o.id));
  const archivedOrders = orders.filter((o) => archivedIds.has(o.id));
  const visibleOrders = activeTab === 'active' ? activeOrders : archivedOrders;

  // Reviews stored in localStorage
  const REVIEWS_KEY = 'thrift_hub_reviews';
  const [reviewedKeys, setReviewedKeys] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]') as Review[];
      // key: orderId-productId
      return new Set(stored.map((r) => (r as Review & { order_item_key?: string }).order_item_key ?? r.product_id));
    } catch { return new Set(); }
  });
  const [activeReview, setActiveReview] = useState<{ orderId: string; item: OrderItem } | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const reviewKey = (orderId: string, item: OrderItem) => `${orderId}-${item.product_id ?? item.id}`;

  const handleOpenReview = (orderId: string, item: OrderItem) => {
    setActiveReview({ orderId, item });
    setReviewRating(0);
    setReviewComment('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReview || reviewRating === 0) return;
    setReviewSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const key = reviewKey(activeReview.orderId, activeReview.item);
    const review = {
      id: uuidv4(),
      product_id: activeReview.item.product_id ?? activeReview.item.id,
      user_name: user?.name ?? 'Pengguna',
      rating: reviewRating,
      comment: reviewComment.trim() || undefined,
      created_at: new Date().toISOString(),
      order_item_key: key,
    };
    try {
      const existing = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
      localStorage.setItem(REVIEWS_KEY, JSON.stringify([...existing, review]));
    } catch { /* ignore */ }
    setReviewedKeys((prev) => new Set([...prev, key]));
    setActiveReview(null);
    setReviewSubmitting(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-600 mb-4">Silakan masuk untuk melihat pesanan Anda.</p>
          <Link href="/auth/login" className="text-amber-800 font-semibold hover:underline">
            Masuk →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Pesanan Saya</h1>
        <p className="text-stone-500 mb-6">
          {activeTab === 'active' ? activeOrders.length : archivedOrders.length} pesanan ditemukan
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-amber-800 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Package className="w-4 h-4" />
            Pesanan Aktif
            {activeOrders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">{activeOrders.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'archived'
                ? 'border-stone-700 text-stone-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Archive className="w-4 h-4" />
            Arsip
            {archivedOrders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-stone-200 text-stone-600 rounded-full">{archivedOrders.length}</span>
            )}
          </button>
        </div>

        {visibleOrders.length === 0 ? (
          <div className="text-center py-20">
            {activeTab === 'archived' ? (
              <>
                <Archive className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-stone-600 mb-2">Arsip kosong</h3>
                <p className="text-stone-500">Pesanan yang diarsipkan akan muncul di sini.</p>
              </>
            ) : (
              <>
                <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-stone-600 mb-2">Belum ada pesanan</h3>
                <p className="text-stone-500 mb-6">Mulai eksplorasi dan buat pesanan pertama Anda!</p>
                <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-amber-800 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-900 transition-colors"
            >
              Belanja Sekarang
            </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {visibleOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                {/* Order header */}
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-stone-500 mb-1">ID Pesanan</p>
                      <p className="font-mono font-bold text-stone-800">{order.id}</p>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="text-xs text-stone-500 mb-1">Tanggal</p>
                      <p className="text-sm text-stone-700">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 mb-1">Total</p>
                      <p className="font-bold text-amber-800">{formatPrice(order.total_price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 mb-1">Status</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    {order.status === 'completed' && (
                      archivedIds.has(order.id) ? (
                        <button
                          onClick={() => handleUnarchive(order.id)}
                          title="Batalkan arsip"
                          className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 font-medium transition-colors border border-stone-200 rounded-lg px-3 py-1.5"
                        >
                          <ArchiveRestore className="w-3.5 h-3.5" />
                          Batalkan Arsip
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(order.id)}
                          title="Arsipkan pesanan"
                          className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-800 font-medium transition-colors border border-stone-200 rounded-lg px-3 py-1.5"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          Arsipkan
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      className="flex items-center gap-1 text-sm text-amber-800 hover:text-amber-900 font-medium transition-colors"
                    >
                      {expanded === order.id ? (
                        <><ChevronUp className="w-4 h-4" /> Sembunyikan</>
                      ) : (
                        <><ChevronDown className="w-4 h-4" /> Detail</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Order details */}
                {expanded === order.id && order.order_items && (
                  <div className="border-t border-stone-100 p-5 bg-stone-50">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-stone-700 mb-3 text-sm uppercase tracking-wide">
                          Item Dipesan
                        </h4>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.id}>
                              <div className="flex items-center gap-3">
                              {item.product_image && (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                                  <Image
                                    src={item.product_image}
                                    alt={item.product_name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-800 truncate">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-stone-500">
                                  Ukuran {item.size} × {item.quantity}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-stone-700 shrink-0">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>

                            {/* Review button / inline form for completed orders */}
                            {order.status === 'completed' && (
                              <div className="ml-15 pl-15">
                                {reviewedKeys.has(reviewKey(order.id, item)) ? (
                                  <div className="flex items-center gap-1.5 text-xs text-green-600 mt-1.5 ml-15">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Ulasan terkirim
                                  </div>
                                ) : activeReview?.orderId === order.id && activeReview?.item.id === item.id ? (
                                  <form onSubmit={handleSubmitReview} className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p className="text-sm font-semibold text-stone-800 mb-3">Ulasan untuk: <span className="text-amber-800">{item.product_name}</span></p>
                                    <div className="mb-3">
                                      <p className="text-xs text-stone-600 mb-1.5">Rating *</p>
                                      <div className="flex items-center gap-1">
                                        {[1,2,3,4,5].map((star) => (
                                          <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className="cursor-pointer hover:scale-110 transition-transform"
                                          >
                                            <Star className={`w-6 h-6 transition-colors ${
                                              star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                                            }`} />
                                          </button>
                                        ))}
                                        {reviewRating > 0 && (
                                          <span className="text-xs text-stone-500 ml-1">{reviewRating}/5</span>
                                        )}
                                      </div>
                                      {reviewRating === 0 && (
                                        <p className="text-xs text-stone-400 mt-1">Klik bintang untuk memberi rating</p>
                                      )}
                                    </div>
                                    <div className="mb-3">
                                      <p className="text-xs text-stone-600 mb-1.5">Komentar (opsional)</p>
                                      <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Bagikan pengalaman Anda..."
                                        rows={3}
                                        maxLength={500}
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:border-amber-500 bg-white outline-none"
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setActiveReview(null)}
                                        className="px-4 py-1.5 text-xs text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                                      >
                                        Batal
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={reviewRating === 0 || reviewSubmitting}
                                        className="px-4 py-1.5 text-xs font-bold text-white bg-amber-800 rounded-lg hover:bg-amber-900 disabled:opacity-40 transition-colors"
                                      >
                                        {reviewSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <button
                                    onClick={() => handleOpenReview(order.id, item)}
                                    className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 transition-colors"
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                    Beri Ulasan
                                  </button>
                                )}
                              </div>
                            )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-stone-700 mb-3 text-sm uppercase tracking-wide">
                          Info Pengiriman
                        </h4>
                        <div className="space-y-2 text-sm text-stone-600">
                          <p><span className="font-medium text-stone-700">Nama:</span> {order.customer_name}</p>
                          <p><span className="font-medium text-stone-700">Email:</span> {order.customer_email}</p>
                          <p><span className="font-medium text-stone-700">Telepon:</span> {order.customer_phone}</p>
                          <p>
                            <span className="font-medium text-stone-700">Alamat:</span>{' '}
                            {order.shipping_address}
                          </p>
                          <p>
                            <span className="font-medium text-stone-700">Pembayaran:</span>{' '}
                            {(order.payment_method ?? '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '-'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order status progress */}
                    <div className="mt-5 pt-4 border-t border-stone-200">
                      <h4 className="font-semibold text-stone-700 mb-3 text-sm">Progres Pesanan</h4>
                      <div className="flex items-center gap-2">
                        {(['pending', 'processing', 'shipped', 'completed'] as const).map(
                          (status, idx) => {
                            const statuses = ['pending', 'processing', 'shipped', 'completed'];
                            const currentIdx = statuses.indexOf(order.status);
                            const isActive = idx <= currentIdx;
                            const isCurrent = status === order.status;
                            return (
                              <div key={status} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                  <div
                                    className={`w-3 h-3 rounded-full border-2 transition-colors ${
                                      isActive
                                        ? 'bg-amber-700 border-amber-700'
                                        : 'bg-white border-stone-300'
                                    } ${isCurrent ? 'ring-4 ring-amber-200' : ''}`}
                                  />
                                  <span
                                    className={`text-xs mt-1 capitalize font-medium ${
                                      isCurrent ? 'text-amber-800' : isActive ? 'text-stone-600' : 'text-stone-400'
                                    }`}
                                  >
                                    {status === 'pending' ? 'Menunggu' : status === 'processing' ? 'Diproses' : status === 'shipped' ? 'Dikirim' : 'Selesai'}
                                  </span>
                                </div>
                                {idx < 3 && (
                                  <div
                                    className={`h-0.5 flex-1 mb-5 transition-colors ${
                                      idx < currentIdx ? 'bg-amber-700' : 'bg-stone-200'
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
