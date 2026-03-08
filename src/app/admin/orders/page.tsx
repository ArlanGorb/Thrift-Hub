'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MOCK_ORDERS } from '@/lib/mockData';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate, getOrderStatusLabel } from '@/lib/utils';
import { Search, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { OrderStatusBadge } from '@/components/ui/Badge';

const ORDERS_KEY = 'thrift_hub_orders';

const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === 'undefined') return [...MOCK_ORDERS];
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      const localOrders: Order[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, Order>();
      MOCK_ORDERS.forEach((o) => map.set(o.id, o));
      localOrders.forEach((o) => map.set(o.id, o));
      return Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch {
      return [...MOCK_ORDERS];
    }
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/auth/login');
  }, [user, loading, router]);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o
    );
    setOrders(updated);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Pesanan</h1>
          <p className="text-stone-500 text-sm mt-0.5">{orders.length} total pesanan</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan ID pesanan, nama, atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-blue-600 outline-none"
          >
            <option value="all">Semua Status</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
            ))}
          </select>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-100 py-16 text-center text-stone-400">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
              Tidak ada pesanan ditemukan.
            </div>
          )}
          {filtered.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                {/* Order header row */}
                <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm font-medium text-stone-800 mt-1">{order.customer_name}</p>
                    <p className="text-xs text-stone-400">{order.customer_email}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-blue-900">{formatPrice(order.total_price)}</p>
                    <p className="text-xs text-stone-400">{formatDate(order.created_at)}</p>
                  </div>

                  {/* Status update */}
                  <div className="flex-shrink-0">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-white focus:border-blue-600 outline-none"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="p-2 rounded-lg hover:bg-stone-50 text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-stone-100 px-5 py-4">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-xs text-stone-400 mb-0.5">Alamat Pengiriman</p>
                        <p className="text-stone-700">{order.shipping_address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-0.5">Telepon</p>
                        <p className="text-stone-700">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-0.5">Metode Pembayaran</p>
                        <p className="text-stone-700 capitalize">{order.payment_method.replace('_', ' ')}</p>
                      </div>
                      {order.notes && (
                        <div>
                          <p className="text-xs text-stone-400 mb-0.5">Catatan</p>
                          <p className="text-stone-700">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {order.order_items && order.order_items.length > 0 && (
                      <div>
                        <p className="text-xs text-stone-400 mb-2">Item ({order.order_items.length})</p>
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-2.5 text-sm">
                              <span className="text-stone-700 font-medium">{item.product_name}</span>
                              <div className="flex items-center gap-4 text-stone-500">
                                <span>×{item.quantity}</span>
                                <span className="font-semibold text-stone-800">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
