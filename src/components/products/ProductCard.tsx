'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, getConditionLabel } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: `${product.id}-${product.size}`,
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      condition: product.condition,
      stock: product.stock,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
  };

  const isLowStock = product.stock > 0 && product.stock <= 2;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card bg-white rounded-2xl overflow-hidden border border-stone-100 group">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden bg-stone-50 aspect-[3/4]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_best_seller && (
            <span className="bg-blue-800 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Paling Laris
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Sisa {product.stock}!
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-stone-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Habis Terjual
            </span>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={`/products/${product.id}`}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 transition-colors"
            title="Lihat cepat"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-4 h-4 text-stone-700" />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 transition-colors disabled:opacity-50"
            title="Tambah ke keranjang"
          >
            <ShoppingCart className="w-4 h-4 text-stone-700" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors ${inWishlist ? 'bg-red-50' : ''}`}
            title={inWishlist ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <Heart className={`w-4 h-4 transition-colors ${inWishlist ? 'text-red-500 fill-red-500' : 'text-stone-700 hover:text-red-500'}`} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-stone-800 text-sm leading-tight hover:text-blue-900 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            {product.size}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              product.condition >= 9
                ? 'bg-green-100 text-green-700'
                : product.condition >= 7
                ? 'bg-blue-100 text-blue-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {getConditionLabel(product.condition)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-900">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-blue-900 text-white hover:bg-blue-950'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Stok Habis' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  );
}
