'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-stone-800">
              Thrift<span className="text-blue-800">Hub</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-stone-800">Selamat datang kembali</h1>
          <p className="text-stone-500 mt-1">Masuk ke akun Anda</p>
        </div>

        {/* Demo hint */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-xs text-stone-600">
          <p className="font-semibold text-blue-900 mb-1">Akun Demo:</p>
          <p>🛒 Pelanggan: <code>user@thrifthub.com</code> / <code>user123</code></p>
          <p>⚙️ Admin: <code>admin@thrifthub.com</code> / <code>admin123</code></p>
          <p className="mt-1 text-stone-500">Atau masukkan email/password untuk masuk sebagai pengguna baru.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl p-3 mb-5">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-blue-600 bg-white"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 pr-11 border border-stone-200 rounded-xl text-sm focus:border-blue-600 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-950 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sedang masuk...
              </>
            ) : 'Masuk'}
          </button>

          <p className="text-center text-sm text-stone-500 mt-5">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-blue-900 font-semibold hover:underline">
              Buat akun baru
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-stone-400 mt-4">
          <Link href="/" className="hover:text-stone-600">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
}
