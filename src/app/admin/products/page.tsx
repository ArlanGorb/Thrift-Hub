'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { Product, ProductForm, PRODUCT_CATEGORIES, PRODUCT_SIZES } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { ConditionBadge } from '@/components/ui/Badge';

const PRODUCTS_KEY = 'thrift_hub_admin_products';

const defaultForm: ProductForm = {
  name: '',
  price: 0,
  category: 'T-Shirts',
  size: 'M',
  condition: 8,
  description: '',
  image: '',
  stock: 1,
  is_featured: false,
  is_best_seller: false,
};

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return MOCK_PRODUCTS;
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      const overrides: Product[] = stored ? JSON.parse(stored) : [];
      const mergedMap = new Map<string, Product>();
      MOCK_PRODUCTS.forEach((p) => mergedMap.set(p.id, p));
      overrides.forEach((p) => mergedMap.set(p.id, p));
      return Array.from(mergedMap.values());
    } catch {
      return MOCK_PRODUCTS;
    }
  });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/auth/login');
  }, [user, loading, router]);



  const persistProducts = useCallback((updated: Product[]) => {
    setProducts(updated);
    // Only persist non-mock or modified products to localStorage
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      size: product.size,
      condition: product.condition,
      description: product.description ?? '',
      image: product.image,
      stock: product.stock,
      is_featured: product.is_featured ?? false,
      is_best_seller: product.is_best_seller ?? false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.image || form.price <= 0) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    let updated: Product[];
    if (editingProduct) {
      updated = products.map((p) =>
        p.id === editingProduct.id
          ? { ...p, ...form, updated_at: new Date().toISOString() }
          : p
      );
    } else {
      const newProduct: Product = {
        ...form,
        id: `custom_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [newProduct, ...products];
    }
    persistProducts(updated);
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    persistProducts(updated);
    setDeleteId(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Produk</h1>
            <p className="text-stone-500 text-sm mt-0.5">{products.length} total item</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-blue-600 outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-left text-xs text-stone-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Ukuran</th>
                  <th className="px-5 py-3">Kondisi</th>
                  <th className="px-5 py-3">Harga</th>
                  <th className="px-5 py-3">Stok</th>
                  <th className="px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                          {product.image && (
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-stone-800 line-clamp-1 max-w-[180px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-stone-500">{product.category}</td>
                    <td className="px-5 py-3 text-stone-500">{product.size}</td>
                    <td className="px-5 py-3">
                      <ConditionBadge condition={product.condition} />
                    </td>
                    <td className="px-5 py-3 font-semibold text-blue-900">{formatPrice(product.price)}</td>
                    <td className="px-5 py-3">
                      <span className={product.stock === 0 ? 'text-red-500' : 'text-stone-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-stone-400 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-stone-400">
                      Tidak ada produk ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="font-bold text-stone-800">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">Nama Produk *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Harga (Rp) *</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Stok</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as typeof form.category }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-blue-600 bg-white"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Ukuran</label>
                  <select
                    value={form.size}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-blue-600 bg-white"
                  >
                    {PRODUCT_SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">Kondisi (1–10)</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.condition}
                  onChange={(e) => setForm((f) => ({ ...f, condition: parseInt(e.target.value) }))}
                  className="w-full accent-blue-800"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-0.5">
                  <span>Buruk (1)</span>
                  <span className="font-semibold text-stone-700">{form.condition}/10</span>
                  <span>Seperti Baru (10)</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">URL Gambar *</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">Deskripsi</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-blue-600 resize-none"
                />
              </div>
              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="accent-blue-800"
                  />
                  <span className="text-sm text-stone-700">Unggulan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_best_seller}
                    onChange={(e) => setForm((f) => ({ ...f, is_best_seller: e.target.checked }))}
                    className="accent-blue-800"
                  />
                  <span className="text-sm text-stone-700">Paling Laris</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.image || form.price <= 0}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-900 rounded-xl hover:bg-blue-950 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-stone-800 mb-1">Hapus Produk?</h3>
            <p className="text-sm text-stone-500 mb-5">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 text-sm bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
