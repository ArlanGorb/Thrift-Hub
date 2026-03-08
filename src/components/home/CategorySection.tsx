import Link from 'next/link';
import { ProductCategory } from '@/lib/types';

const categories: { name: ProductCategory; emoji: string; image: string; count: number }[] = [
  {
    name: 'T-Shirts',
    emoji: '👕',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop',
    count: 45,
  },
  {
    name: 'Hoodies',
    emoji: '🧥',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&auto=format&fit=crop',
    count: 23,
  },
  {
    name: 'Jackets',
    emoji: '🧣',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&auto=format&fit=crop',
    count: 31,
  },
  {
    name: 'Sweaters',
    emoji: '🧶',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&auto=format&fit=crop',
    count: 18,
  },
  {
    name: 'Vintage Clothing',
    emoji: '✨',
    image: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=400&auto=format&fit=crop',
    count: 52,
  },
  {
    name: 'Jeans',
    emoji: '👖',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&auto=format&fit=crop',
    count: 28,
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-amber-700 font-semibold text-sm uppercase tracking-wider mb-2">
            Jelajahi Berdasarkan Gaya
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">Belanja Berdasarkan Kategori</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-2xl aspect-square shadow-sm hover:shadow-md transition-all"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-3 text-center">
                <span className="text-2xl mb-1">{cat.emoji}</span>
                <h3 className="text-white font-bold text-xs sm:text-sm leading-tight">
                  {cat.name}
                </h3>
                <p className="text-white/70 text-xs mt-0.5">{cat.count} produk</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
