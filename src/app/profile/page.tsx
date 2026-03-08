'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, LogOut, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
  });

  if (!loading && !user) {
    router.push('/auth/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // In demo mode, persist name changes to localStorage
    const stored = localStorage.getItem('thrift_hub_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        localStorage.setItem('thrift_hub_user', JSON.stringify({ ...parsed, ...form }));
      } catch {}
    }
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800">Profil Saya</h1>
          <p className="text-stone-500 text-sm mt-1">Kelola detail akun Anda</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-3">
            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-900">
                  {(form.name || user?.email || 'U')[0].toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-stone-800">{form.name || 'Pembeli Thrift'}</p>
              <p className="text-stone-500 text-sm">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-900 font-semibold px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-100">
              <Link
                href="/orders"
                className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-stone-700">
                  <ShoppingBag className="w-4 h-4 text-blue-800" />
                  <span className="text-sm font-medium">Pesanan Saya</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-stone-700">
                  <Heart className="w-4 h-4 text-blue-800" />
                  <span className="text-sm font-medium">Favorit</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-stone-700">
                    <User className="w-4 h-4 text-blue-800" />
                    <span className="text-sm font-medium">Dasbor Admin</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-5">Detail Akun</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  <User className="inline w-3.5 h-3.5 mr-1 text-stone-400" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  <Mail className="inline w-3.5 h-3.5 mr-1 text-stone-400" />
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  <Phone className="inline w-3.5 h-3.5 mr-1 text-stone-400" />
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="08xx-xxxx-xxxx"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 mr-1 text-stone-400" />
                  Alamat Pengiriman
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Jalan, Kota, Provinsi, Kode Pos"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:border-blue-600 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-blue-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-950 disabled:opacity-50 transition-all active:scale-95"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : saved ? (
                  '✓ Tersimpan!'
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
