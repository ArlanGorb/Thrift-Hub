import Link from 'next/link';
import { Leaf, Users, Recycle, ShoppingBag, Heart, BookOpen, MapPin, Mail, Instagram } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami – ThriftHub UNKLAB',
  description:
    'ThriftHub adalah platform jual beli barang bekas khusus untuk mahasiswa Universitas Klabat (UNKLAB). Belanja hemat, ramah lingkungan, dan dukung sesama mahasiswa.',
};

const STATS = [
  { value: '500+', label: 'Mahasiswa Terdaftar' },
  { value: '1.200+', label: 'Produk Terjual' },
  { value: '12', label: 'Fakultas' },
  { value: '4,9★', label: 'Rating Rata-rata' },
];

const VALUES = [
  {
    icon: <Recycle className="w-6 h-6 text-blue-800" />,
    title: 'Berkelanjutan',
    desc: 'Memperpanjang umur pakaian dan barang bekas agar tidak berakhir di tempat sampah. Setiap transaksi adalah langkah kecil menuju kampus yang lebih hijau.',
  },
  {
    icon: <Users className="w-6 h-6 text-blue-800" />,
    title: 'Komunitas Mahasiswa',
    desc: 'Dibangun dari, oleh, dan untuk mahasiswa UNKLAB. Platform ini menghubungkan sesama mahasiswa yang ingin menjual atau mencari barang dengan harga terjangkau.',
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-blue-800" />,
    title: 'Hemat & Terjangkau',
    desc: 'Mahasiswa punya budget terbatas. ThriftHub hadir agar kamu bisa tampil keren dan memenuhi kebutuhan sehari-hari tanpa harus menguras kantong.',
  },
  {
    icon: <Heart className="w-6 h-6 text-blue-800" />,
    title: 'Saling Mendukung',
    desc: 'Dengan berbelanja di ThriftHub, kamu langsung mendukung teman sesama mahasiswa. Uang beredar di dalam komunitas kampus sendiri.',
  },
];

const TEAM = [
  { name: 'Tim Pengembang', role: 'Mahasiswa Ilmu Komputer UNKLAB', emoji: '💻' },
  { name: 'Tim Desain', role: 'Mahasiswa Desain Komunikasi Visual UNKLAB', emoji: '🎨' },
  { name: 'Tim Pemasaran', role: 'Mahasiswa Manajemen Bisnis UNKLAB', emoji: '📢' },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-stone-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Leaf className="w-4 h-4 text-green-300" />
            Platform Thrift Khusus Mahasiswa UNKLAB
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Tentang <span className="text-blue-500">ThriftHub</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Marketplace jual beli barang bekas yang dirancang khusus untuk
            mahasiswa <span className="font-semibold text-white">Universitas Klabat (UNKLAB)</span> —
            hemat, berkelanjutan, dan mempererat komunitas kampus.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-stone-100 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-blue-900">{s.value}</p>
              <p className="text-sm text-stone-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tentang Platform */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-800">Siapa Kami</span>
              <h2 className="text-3xl font-bold text-stone-800 mt-2 mb-4">
                Lahir dari kebutuhan<br />nyata mahasiswa
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed text-sm">
                <p>
                  <strong>ThriftHub</strong> adalah platform jual beli barang bekas yang lahir dari komunitas
                  mahasiswa Universitas Klabat (UNKLAB), Airmadidi, Sulawesi Utara. Berawal dari
                  kesadaran bahwa banyak mahasiswa memiliki barang layak pakai yang tidak lagi
                  digunakan, sementara mahasiswa lain membutuhkan barang serupa dengan harga terjangkau.
                </p>
                <p>
                  Kami hadir untuk menjembatani keduanya — menciptakan ekosistem belanja hemat,
                  ramah lingkungan, dan berbasis kepercayaan sesama sivitas akademika UNKLAB.
                </p>
                <p>
                  Dari pakaian, buku, peralatan kuliah, hingga elektronik — semua bisa
                  diperjualbelikan di sini selama masih layak guna.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-stone-800">Universitas Klabat</p>
                  <p className="text-xs text-stone-500">Airmadidi, Sulawesi Utara</p>
                </div>
              </div>
              <blockquote className="text-stone-600 text-sm italic leading-relaxed border-l-4 border-blue-400 pl-4">
                &ldquo;ThriftHub mewujudkan semangat gotong royong di kampus — saling membantu,
                saling menguntungkan, dan bersama-sama menjaga lingkungan.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai & Visi */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-800">Nilai Kami</span>
            <h2 className="text-3xl font-bold text-stone-800 mt-2">Mengapa ThriftHub?</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="flex gap-4 p-5 rounded-2xl border border-stone-100 hover:border-blue-300 transition-colors bg-stone-50">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">{v.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-800">Dibangun Oleh</span>
          <h2 className="text-3xl font-bold text-stone-800 mt-2 mb-10">Tim Mahasiswa UNKLAB</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {TEAM.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                <div className="text-4xl mb-3">{t.emoji}</div>
                <p className="font-semibold text-stone-800">{t.name}</p>
                <p className="text-sm text-stone-500 mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="bg-white py-16 px-4 border-t border-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-800">Kontak</span>
            <h2 className="text-3xl font-bold text-stone-800 mt-2">Hubungi Kami</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 text-center">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100">
              <MapPin className="w-6 h-6 text-blue-800 mx-auto mb-2" />
              <p className="font-semibold text-stone-800 text-sm">Lokasi</p>
              <p className="text-sm text-stone-500 mt-1">Universitas Klabat<br />Airmadidi, Sulawesi Utara</p>
            </div>
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100">
              <Mail className="w-6 h-6 text-blue-800 mx-auto mb-2" />
              <p className="font-semibold text-stone-800 text-sm">Email</p>
              <a href="mailto:thrifthub@unklab.ac.id" className="text-sm text-blue-800 hover:underline mt-1 block">
                thrifthub@unklab.ac.id
              </a>
            </div>
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100">
              <Instagram className="w-6 h-6 text-blue-800 mx-auto mb-2" />
              <p className="font-semibold text-stone-800 text-sm">Instagram</p>
              <a href="#" className="text-sm text-blue-800 hover:underline mt-1 block">
                @thrifthub.unklab
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-950 text-white py-14 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Siap bergabung dengan komunitas ThriftHub?</h2>
        <p className="text-blue-300 mb-7 text-sm">Daftar gratis dan mulai jual beli barang bekas bersama mahasiswa UNKLAB.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-blue-950 font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Daftar Sekarang
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Lihat Produk
          </Link>
        </div>
      </section>
    </div>
  );
}
