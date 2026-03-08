'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ShoppingBag, Package, TrendingUp, DollarSign, LayoutDashboard, ListOrdered, ChevronRight, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orderCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem('thrift_hub_orders');
      const orders = stored ? JSON.parse(stored) : [];
      return orders.length;
    } catch { return 0; }
  });
  const [revenue] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem('thrift_hub_orders');
      const orders = stored ? JSON.parse(stored) : [];
      return orders.reduce((sum: number, o: { total_price: number }) => sum + (o.total_price ?? 0), 0);
    } catch { return 0; }
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Produk',
      value: MOCK_PRODUCTS.length,
      icon: <Package className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-800',
    },
    {
      label: 'Pesanan Masuk',
      value: orderCount,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Pendapatan',
      value: formatPrice(revenue),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Item Unggulan',
      value: MOCK_PRODUCTS.filter((p) => p.is_featured).length,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-purple-50 text-purple-700',
    },
  ];

  const quickLinks = [
    { label: 'Kelola Produk', description: 'Tambah, edit, atau hapus produk', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Kelola Pesanan', description: 'Lihat dan perbarui status pesanan', href: '/admin/orders', icon: <ListOrdered className="w-5 h-5" /> },
    { label: 'Lihat Toko', description: 'Jelajahi katalog produk', href: '/products', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Profil Pelanggan', description: 'Lihat informasi akun & peran', href: '/profile', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Dasbor Admin</h1>
            <p className="text-stone-500 text-sm">Selamat datang, {user.name || user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-5">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
              <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-stone-700 mb-4">Aksi Cepat</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-2xl border border-stone-100 p-5 flex items-center justify-between hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-800">
                  {link.icon}
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{link.label}</p>
                  <p className="text-xs text-stone-400">{link.description}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-blue-800 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
