import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';

export default function SustainabilityBanner() {
  return (
    <section className="py-16 bg-stone-800 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-800/50 text-green-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Leaf className="w-4 h-4" />
          Mengapa Thrift?
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Fashion dengan <span className="text-amber-400">Nurani</span>
        </h2>

        <p className="text-stone-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Industri fashion adalah salah satu pencemar terbesar di dunia. Dengan membeli
          barang bekas, kamu memperpanjang umur pakaian, mengurangi limbah, dan menurunkan jejak karbon —
          sambil menemukan item unik dengan harga jauh lebih murah.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {[
            { stat: '2.700L', desc: 'Air yang dihemat setiap pembelian thrift vs. jeans baru' },
            { stat: '60%', desc: 'Lebih sedikit jejak karbon vs. membeli fast fashion' },
            { stat: '92 Juta', desc: 'Ton limbah tekstil dihasilkan setiap tahun di seluruh dunia' },
          ].map((item) => (
            <div key={item.stat} className="bg-stone-700/50 rounded-xl p-5">
              <p className="text-3xl font-bold text-amber-400 mb-1">{item.stat}</p>
              <p className="text-stone-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-600/30 active:scale-95"
        >
          Mulai Belanja Berkelanjutan <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
