import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import ProductCard from '@/components/products/ProductCard';

export default function FeaturedProducts() {
  const featured = MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-700 font-semibold text-sm uppercase tracking-wider mb-2">
            Pilihan Terbaik
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">      
              Temuan Thrift Unggulan
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:text-amber-900 transition-colors"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:text-amber-900"
          >
            Lihat Semua Produk <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
