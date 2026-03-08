'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Leaf,
  Search,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Belanja' },
  { href: '/products?category=T-Shirts', label: 'Kaos' },
  { href: '/products?category=Jackets', label: 'Jaket' },
  { href: '/products?category=Vintage+Clothing', label: 'Vintage' },
  { href: '/tentang', label: 'Tentang Kami' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      {/* Top announcement bar */}
      <div className="bg-stone-800 text-white text-center py-2 text-xs tracking-wide font-medium">
        🌿 Gratis ongkir untuk pembelian di atas Rp 500.000 &nbsp;|&nbsp; Fashion Berkelanjutan untuk Semua
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-amber-800 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
              Thrift<span className="text-amber-700">Hub</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium nav-link pb-0.5 transition-colors ${
                  pathname === link.href
                    ? 'text-amber-800'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-3">
            <Link href="/products?search=" className="p-2 text-stone-600 hover:text-stone-900 transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-amber-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-lg hover:bg-stone-100"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-100 z-20 py-2">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-sm font-semibold text-stone-800">{user.name}</p>
                        <p className="text-xs text-stone-500">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profil Saya
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <Package className="w-4 h-4" /> Pesanan Saya
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <Heart className="w-4 h-4" /> Favorit
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dasbor Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-stone-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-stone-700 hover:text-stone-900 px-3 py-1.5 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium bg-amber-800 text-white px-4 py-1.5 rounded-lg hover:bg-amber-900 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-stone-600 hover:text-stone-900"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-stone-100">
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-50 rounded-lg">Profil Saya</Link>
                <Link href="/orders" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-50 rounded-lg">Pesanan Saya</Link>
                {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-amber-700 hover:bg-amber-50 rounded-lg font-medium">Dasbor Admin</Link>}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">Keluar</button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm font-medium border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50">Masuk</Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm font-medium bg-amber-800 text-white rounded-lg hover:bg-amber-900">Daftar</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
