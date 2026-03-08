'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/utils';
import { ConditionBadge } from '@/components/ui/Badge';

export default function WishlistPage() {
  const { addItem } = useCart();
  const { items: wishlist, removeItem: removeFromWishlist } = useWishlist();

  const handleAddToCart = (product: (typeof wishlist)[number]) => {
    addItem({
      id: `${product.id}-${product.size}`,
      product_id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      size: product.size,
      condition: product.condition,
      stock: product.stock,
    });
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-9 h-9 text-stone-400" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Favorit Anda kosong</h1>
          <p className="text-stone-500 mb-6">Simpan item favorit dan temukan di sini nanti.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-950 transition-colors"
          >
            Jelajahi Produk
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Favorit</h1>
            <p className="text-stone-500 text-sm mt-1">{wishlist.length} item tersimpan</p>
          </div>
          <Link href="/products" className="text-blue-900 text-sm font-semibold hover:underline">
            Lanjut Belanja →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden group shadow-sm">
              <div className="relative overflow-hidden h-52">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm transition-colors"
                  title="Hapus dari favorit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/products/${product.id}`} className="hover:text-blue-900 transition-colors">
                  <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-1">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-stone-500">{product.category}</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500">Ukuran {product.size}</span>
                  <ConditionBadge condition={product.condition} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-lg">{formatPrice(product.price)}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex items-center gap-1.5 bg-blue-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-950 disabled:bg-stone-200 disabled:text-stone-400 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
