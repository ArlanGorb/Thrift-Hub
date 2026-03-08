'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { PRODUCT_CATEGORIES, PRODUCT_SIZES, ProductFilters, ProductCategory } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';

function ProductsContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProductFilters>({
    category: (searchParams.get('category') as ProductCategory) || '',
    size: searchParams.get('size') || '',
    minPrice: undefined,
    maxPrice: undefined,
    search: searchParams.get('search') || '',
  });
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Derived state: sync filters when URL searchParams change
  const [syncedParams, setSyncedParams] = useState(searchParams);
  if (syncedParams !== searchParams) {
    setSyncedParams(searchParams);
    const cat = searchParams.get('category') as ProductCategory | null;
    const s = searchParams.get('search');
    if (cat || s) {
      setFilters((f) => ({
        ...f,
        ...(cat ? { category: cat } : {}),
        ...(s ? { search: s } : {}),
      }));
      if (s) setSearchInput(s);
    }
  }

  const filtered = useMemo(() => {
    let products = [...MOCK_PRODUCTS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    if (filters.size) {
      products = products.filter((p) => p.size === filters.size);
    }
    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    switch (sortBy) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'condition':
        products.sort((a, b) => b.condition - a.condition);
        break;
      default:
        products.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return products;
  }, [filters, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput }));
  };

  const clearFilters = () => {
    setFilters({ category: '', size: '', minPrice: undefined, maxPrice: undefined, search: '' });
    setSearchInput('');
  };

  const activeFilterCount = [
    filters.category,
    filters.size,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            {filters.category ? filters.category : 'Semua Produk'}
          </h1>
          <p className="text-stone-500">
            {filtered.length} item ditemukan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:border-blue-600 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-900 text-white rounded-xl text-sm font-medium hover:bg-blue-950 transition-colors"
            >
              Cari
            </button>
          </form>

          <div className="flex gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:border-stone-300 bg-white transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-blue-800 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:border-stone-300 bg-white transition-colors cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga: Rendah ke Tinggi</option>
                <option value="price_desc">Harga: Tinggi ke Rendah</option>
                <option value="condition">Kondisi Terbaik</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 shrink-0`}
          >
            <div className="bg-white rounded-2xl border border-stone-100 p-5 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">Filter</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Hapus semua
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <h4 className="text-sm font-semibold text-stone-700 mb-3">Kategori</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!filters.category}
                      onChange={() => setFilters((f) => ({ ...f, category: '' }))}
                      className="text-blue-800 accent-blue-800"
                    />
                    <span className="text-sm text-stone-600">Semua</span>
                  </label>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={() => setFilters((f) => ({ ...f, category: cat }))}
                        className="accent-blue-800"
                      />
                      <span className="text-sm text-stone-600">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="text-sm font-semibold text-stone-700 mb-3">Ukuran</h4>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setFilters((f) => ({ ...f, size: f.size === size ? '' : size }))
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        filters.size === size
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h4 className="text-sm font-semibold text-stone-700 mb-3">Rentang Harga</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice ?? ''}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                    min="0"
                  />
                  <span className="text-stone-400">—</span>
                  <input
                    type="number"
                    placeholder="Maks"
                    value={filters.maxPrice ?? ''}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                    min="0"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    { label: 'Rp 0–100rb', min: 0, max: 100000 },
                    { label: 'Rp 100–300rb', min: 100000, max: 300000 },
                    { label: 'Rp 300rb+', min: 300000, max: undefined },
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          minPrice: range.min,
                          maxPrice: range.max,
                        }))
                      }
                      className="text-xs px-2.5 py-1 border border-stone-200 rounded-lg text-stone-600 hover:border-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Produk tidak ditemukan</h3>
                <p className="text-stone-500 mb-6">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-sm font-medium hover:bg-blue-950 transition-colors"
                >
                  Hapus Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
