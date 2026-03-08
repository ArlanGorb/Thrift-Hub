'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '@/lib/mockData';
import { formatPrice, getConditionLabel, formatDate, calculateAverageRating } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/products/ProductCard';
import StarRating from '@/components/ui/StarRating';
import { ConditionBadge } from '@/components/ui/Badge';
import ReviewForm from '@/components/products/ReviewForm';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleItem, isInWishlist } = useWishlist();

  const product = MOCK_PRODUCTS.find((p) => p.id === params.id);
  if (!product) return notFound();

  const productReviews = MOCK_REVIEWS.filter((r) => r.product_id === product.id);
  const inWishlist = isInWishlist(product.id);
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      reviews={productReviews}
      relatedProducts={relatedProducts}
      addItem={addItem}
      user={user}
      toggleWishlist={() => toggleItem(product)}
      inWishlist={inWishlist}
    />
  );
}

function ProductDetailClient({
  product,
  reviews,
  relatedProducts,
  addItem,
  user,
  toggleWishlist,
  inWishlist,
}: {
  product: ReturnType<typeof MOCK_PRODUCTS.find> & object;
  reviews: typeof MOCK_REVIEWS;
  relatedProducts: typeof MOCK_PRODUCTS;
  addItem: ReturnType<typeof useCart>['addItem'];
  user: ReturnType<typeof useAuth>['user'];
  toggleWishlist: () => void;
  inWishlist: boolean;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [localReviews, setLocalReviews] = useState(() => {
    try {
      const stored = JSON.parse(
        (typeof window !== 'undefined' ? localStorage.getItem('thrift_hub_reviews') : null) || '[]'
      ) as Array<{ id: string; product_id: string; user_name: string; rating: number; comment?: string; created_at: string }>;
      const productStored = stored.filter((r) => r.product_id === product.id);
      if (productStored.length === 0) return reviews;
      const existingIds = new Set(reviews.map((r) => r.id));
      const newOnes = productStored.filter((r) => !existingIds.has(r.id));
      return newOnes.length === 0 ? reviews : [...newOnes, ...reviews];
    } catch {
      return reviews;
    }
  });

  const avgRating = calculateAverageRating(localReviews.map((r) => r.rating));
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  if (!product) return null;

  const isNumericSize = /^\d+$/.test(product.size);
  const allSizes = isNumericSize ? ['28', '30', '32', '34', '36'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableSizes: string[] = product.available_sizes ?? [product.size];
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${selectedSize}`,
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        condition: product.condition,
        stock: product.stock,
        quantity: 1,
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="hover:text-stone-700">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-stone-700">Produk</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/products?category=${product.category}`} className="hover:text-stone-700">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-stone-800 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Produk
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Image gallery */}
          <div>
            <div className="relative bg-white rounded-2xl overflow-hidden aspect-square shadow-sm mb-3">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === idx ? 'border-amber-700' : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleWishlist}
                  className={`p-2 rounded-lg transition-colors ${
                    inWishlist
                      ? 'text-red-500 bg-red-50 hover:bg-red-100'
                      : 'text-stone-500 hover:text-red-500 hover:bg-red-50'
                  }`}
                  aria-label={inWishlist ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
                </button>
                <button className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-colors" aria-label="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={avgRating} showNumber />
              <span className="text-sm text-stone-500">({localReviews.length} ulasan)</span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-amber-800 mb-5">
              {formatPrice(product.price)}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {/* Size selector */}
              <div className="col-span-2 bg-stone-50 rounded-xl p-4">
                <p className="text-xs text-stone-500 mb-2">
                  Pilih Ukuran
                  {selectedSize && <span className="ml-2 font-semibold text-stone-800">— {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => {
                    const isAvailable = availableSizes.includes(size);
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedSize(size);
                            setSizeError(false);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`min-w-[42px] h-10 px-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                          isSelected
                            ? 'border-amber-700 bg-amber-700 text-white shadow-sm'
                            : isAvailable
                            ? 'border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:text-amber-700'
                            : 'border-stone-200 bg-stone-50 text-stone-300 line-through cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {sizeError && (
                  <p className="text-xs text-red-500 mt-2">Silakan pilih ukuran terlebih dahulu</p>
                )}
              </div>
              <div className="bg-stone-50 rounded-xl p-3">
                <p className="text-xs text-stone-500 mb-1">Kondisi</p>
                <ConditionBadge condition={product.condition} />
              </div>
              <div className="bg-stone-50 rounded-xl p-3">
                <p className="text-xs text-stone-500 mb-1">Stok</p>
                <p className={`font-semibold ${product.stock <= 2 ? 'text-orange-600' : 'text-stone-800'}`}>
                  {product.stock === 0 ? 'Habis Terjual' : `${product.stock} tersedia`}
                </p>
              </div>
              <div className="col-span-2 bg-stone-50 rounded-xl p-3">
                <p className="text-xs text-stone-500 mb-1">Rating Kondisi</p>
                <p className="font-semibold text-stone-800">{product.condition}/10 — {getConditionLabel(product.condition)}</p>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-stone-600 leading-relaxed text-sm mb-6">{product.description}</p>
            )}

            {/* Quantity + Add to cart */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-stone-200 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 rounded-l-xl transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 rounded-r-xl transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-800 text-white font-semibold py-3 rounded-xl hover:bg-amber-900 active:scale-95 transition-all disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5" /> Tambah ke Keranjang
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="w-full py-3 bg-stone-100 text-stone-500 font-semibold rounded-xl text-center mb-4">
                Item ini sudah habis terjual
              </div>
            )}

            <Link
              href="/cart"
              className="block w-full text-center border-2 border-amber-800 text-amber-800 font-semibold py-3 rounded-xl hover:bg-amber-50 transition-colors"
            >
              Lihat Keranjang
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Package, text: 'Dikemas dengan hati-hati' },
                { icon: Truck, text: 'Pengiriman cepat' },
                { icon: Shield, text: 'Pembayaran aman' },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center text-center gap-1.5">
                  <item.icon className="w-5 h-5 text-amber-700" />
                  <span className="text-xs text-stone-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-10">
          <h2 className="text-xl font-bold text-stone-800 mb-6">
            Ulasan Pelanggan
            {localReviews.length > 0 && (
              <span className="ml-2 text-base font-normal text-stone-500">
                ({localReviews.length})
              </span>
            )}
          </h2>

          {localReviews.length > 0 ? (
            <>
              <div className="flex items-center gap-4 mb-6 p-4 bg-amber-50 rounded-xl">
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-800">{avgRating.toFixed(1)}</p>
                  <StarRating rating={avgRating} size="sm" />
                  <p className="text-xs text-stone-500 mt-1">{localReviews.length} ulasan</p>
                </div>
              </div>

              <div className="space-y-4">
                {localReviews.map((review) => (
                  <div key={review.id} className="border-b border-stone-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold">
                          {review.user_name.charAt(0)}
                        </div>
                        <span className="font-semibold text-stone-800 text-sm">{review.user_name}</span>
                      </div>
                      <span className="text-xs text-stone-400">{formatDate(review.created_at)}</span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                    {review.comment && (
                      <p className="text-stone-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-stone-500 text-sm">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>
          )}

          {/* Review form */}
          {user ? (
            <ReviewForm
              productId={product.id}
              userName={user.name}
              onSubmit={(review: import('@/lib/types').Review) => setLocalReviews((prev) => [review, ...prev])}
            />
          ) : (
            <div className="mt-6 p-4 bg-stone-50 rounded-xl text-center">
              <p className="text-stone-600 text-sm mb-3">
                <Link href="/auth/login" className="text-amber-700 font-semibold hover:underline">
                  Masuk
                </Link>{' '}
                untuk memberikan ulasan.
              </p>
            </div>
          )}
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-stone-800 mb-6">Anda Mungkin Juga Suka</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
