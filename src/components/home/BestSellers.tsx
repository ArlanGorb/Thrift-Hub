import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import ProductCard from '@/components/products/ProductCard';

export default function BestSellers() {
  const bestSellers = MOCK_PRODUCTS.filter((p) => p.is_best_seller).slice(0, 4);

  return (
    <section className="py-16 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-800" />
              <p className="text-blue-800 font-semibold text-sm uppercase tracking-wider">
                Trending Now
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">Best Sellers</h2>
          </div>
          <Link
            href="/products?best_seller=true"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-blue-900 hover:text-blue-950 transition-colors"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
