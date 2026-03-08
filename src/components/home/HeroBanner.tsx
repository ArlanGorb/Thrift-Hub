import Link from 'next/link';
import { ArrowRight, Leaf, Recycle, Package } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="hero-gradient relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Decorative circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-amber-700/40 text-amber-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Leaf className="w-4 h-4" />
              Fashion Berkelanjutan
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Berpakaian Lebih Baik,{' '}
              <span className="text-amber-400">Berpikir Lebih Hijau</span>
            </h1>

            <p className="text-amber-100/90 text-lg leading-relaxed mb-8 max-w-lg">
              Temukan fashion bekas unik dengan harga terbaik. Setiap barang yang kamu beli
              memberi kehidupan kedua bagi pakaian dan membantu mengurangi limbah tekstil.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30 active:scale-95"
              >
                Belanja Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all active:scale-95"
              >
                Lihat Pilihan Unggulan
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: '500+', label: 'Produk Tersedia' },
                { value: '1.200+', label: 'Pelanggan Puas' },
                { value: '4,8★', label: 'Rating Rata-rata' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-amber-400">{stat.value}</p>
                  <p className="text-sm text-amber-100/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Feature cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              {
                icon: Leaf,
                title: 'Ramah Lingkungan',
                desc: 'Kurangi limbah fashion dengan memilih pakaian bekas.',
                bg: 'bg-green-900/40',
                iconColor: 'text-green-400',
              },
              {
                icon: Package,
                title: 'Kualitas Terjamin',
                desc: 'Setiap item dinilai dan dideskripsikan secara jujur.',
                bg: 'bg-amber-900/40',
                iconColor: 'text-amber-400',
              },
              {
                icon: Recycle,
                title: 'Fashion Sirkular',
                desc: 'Bergabung dalam ekonomi sirkular — beli, pakai, jual kembali.',
                bg: 'bg-sky-900/40',
                iconColor: 'text-sky-400',
              },
              {
                icon: ArrowRight,
                title: 'Pengembalian Mudah',
                desc: 'Tidak puas? Kembalikan dalam 7 hari tanpa ribet.',
                bg: 'bg-purple-900/40',
                iconColor: 'text-purple-400',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`${item.bg} backdrop-blur-sm rounded-2xl p-5 border border-white/10`}
              >
                <item.icon className={`w-8 h-8 ${item.iconColor} mb-3`} />
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
