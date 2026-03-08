import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Sarah K.',
    avatar: 'SK',
    rating: 5,
    review:
      "Saya sudah belanja di Thrift Hub berbulan-bulan dan semakin cinta! Kualitas setiap item luar biasa dan saya suka betapa ramah lingkungannya.",
    item: 'Vintage Denim Jacket',
    date: '2 minggu lalu',
  },
  {
    name: 'James T.',
    avatar: 'JT',
    rating: 5,
    review:
      'Toko thrift online terbaik. Rating kondisinya tepat dan pengirimannya sangat cepat. Menemukan hoodie yang selama ini saya cari-cari!',
    item: 'Streetwear Hoodie',
    date: '1 bulan lalu',
  },
  {
    name: 'Aisha M.',
    avatar: 'AM',
    rating: 5,
    review:
      'Sangat puas dengan pembelian saya! Barang persis seperti yang dideskripsikan. Pengemasannya rapi dan ramah lingkungan. Pasti akan kembali lagi!',
    item: 'Cozy Knit Sweater',
    date: '3 minggu lalu',
  },
];

export default function ReviewHighlights() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-amber-700 font-semibold text-sm uppercase tracking-wider mb-2">
            Komunitas Kami
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3">
            Apa Kata Pelanggan
          </h2>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-stone-600 font-medium ml-1">4,9 dari 5 (1.200+ ulasan)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="bg-stone-50 rounded-2xl p-6 border border-stone-100 relative"
            >
              <Quote className="w-8 h-8 text-amber-200 absolute top-4 right-4" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center text-sm font-bold">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold text-stone-800">{review.name}</p>
                  <p className="text-xs text-stone-500">{review.date}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-stone-600 text-sm leading-relaxed mb-4">&ldquo;{review.review}&rdquo;</p>

              <p className="text-xs text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-full inline-block">
                Dibeli: {review.item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
