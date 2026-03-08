'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabels = ['', 'Lemah', 'Cukup', 'Baik', 'Kuat'];
  const strengthColors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
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
            <div className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-stone-800">
              Thrift<span className="text-amber-700">Hub</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-stone-800">Buat akun Anda</h1>
          <p className="text-stone-500 mt-1">Bergabung dengan ribuan pembeli bijak</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl p-3 mb-5">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-amber-500 bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-amber-500 bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="w-full px-4 py-2.5 pr-11 border border-stone-200 rounded-xl text-sm focus:border-amber-500 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strength >= level ? strengthColors[strength] : 'bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-500">{strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi Anda"
                required
                className={`w-full px-4 py-2.5 pr-11 border rounded-xl text-sm bg-white transition-colors ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-red-400'
                    : 'border-stone-200 focus:border-amber-500'
                }`}
              />
              {confirmPassword && password === confirmPassword && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-800 text-white font-bold py-3 rounded-xl hover:bg-amber-900 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Membuat akun...
              </>
            ) : 'Buat Akun'}
          </button>

          <p className="text-center text-sm text-stone-500 mt-5">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-amber-800 font-semibold hover:underline">
              Masuk
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
