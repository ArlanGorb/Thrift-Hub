import Link from 'next/link';
import { Leaf, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const SHOP_LINKS = [
  { href: '/products', label: 'Semua Produk' },
  { href: '/products?category=T-Shirts', label: 'Kaos' },
  { href: '/products?category=Hoodies', label: 'Hoodie' },
  { href: '/products?category=Jackets', label: 'Jaket' },
  { href: '/products?category=Vintage+Clothing', label: 'Vintage' },
  { href: '/products?category=Jeans', label: 'Jeans' },
  { href: '/tentang', label: 'Tentang Kami' },
];

const ACCOUNT_LINKS = [
  { href: '/auth/login', label: 'Masuk' },
  { href: '/auth/register', label: 'Buat Akun' },
  { href: '/profile', label: 'Profil Saya' },
  { href: '/orders', label: 'Pesanan Saya' },
  { href: '/wishlist', label: 'Favorit' },
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-amber-700 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Thrift<span className="text-amber-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              Platform jual beli barang bekas khusus mahasiswa
              <span className="text-amber-400 font-medium"> Universitas Klabat (UNKLAB)</span>.
              Belanja hemat, tampil keren, dan jaga lingkungan bersama.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Belanja</h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Akun</h4>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-stone-400">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                <span>Universitas Klabat, Airmadidi, Sulawesi Utara</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-stone-400">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>+62 431-891035</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-stone-400">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="mailto:thrifthub@unklab.ac.id" className="hover:text-amber-400 transition-colors">
                  thrifthub@unklab.ac.id
                </a>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-stone-800 rounded-lg">
              <p className="text-xs text-stone-400 leading-relaxed">
                🌿 <span className="text-green-400 font-medium">Ramah Lingkungan</span> — Setiap pembelian memperpanjang
                umur pakaian dan mengurangi limbah tekstil.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-500">
            &copy; {new Date().getFullYear()} ThriftHub. Semua hak dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-stone-500">
            <a href="#" className="hover:text-stone-300 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Syarat Layanan</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Kebijakan Pengiriman</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
