'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Home } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'TH-XXXXXX';

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-stone-800 mb-3">Pesanan Diterima! 🎉</h1>
        <p className="text-stone-600 mb-6 leading-relaxed">
          Terima kasih telah berbelanja secara bijak! Pesanan Anda telah diterima dan sedang diproses.
        </p>

        {/* Order ID */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6">
          <p className="text-sm text-stone-600 mb-1">ID Pesanan Anda</p>
          <p className="text-2xl font-mono font-bold text-amber-800 tracking-wider">{orderId}</p>
          <p className="text-xs text-stone-500 mt-2">Simpan ID ini untuk melacak pesanan Anda</p>
        </div>

        {/* Order status timeline */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 mb-6 text-left">
          <h3 className="font-semibold text-stone-800 mb-4">Apa yang terjadi selanjutnya?</h3>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Pesanan Dikonfirmasi', desc: 'Pesanan Anda sedang ditinjau', done: true },
              { step: '2', title: 'Sedang Diproses', desc: 'Kami menyiapkan dan mengemas item Anda', done: false },
              { step: '3', title: 'Dikirim', desc: 'Paket Anda sedang dalam perjalanan', done: false },
              { step: '4', title: 'Terkirim', desc: 'Nikmati barang thrift Anda!', done: false },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    item.done
                      ? 'bg-green-100 text-green-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {item.done ? '✓' : item.step}
                </div>
                <div>
                  <p className={`font-medium text-sm ${item.done ? 'text-green-700' : 'text-stone-600'}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-stone-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center gap-2 bg-amber-800 text-white font-semibold py-3 rounded-xl hover:bg-amber-900 transition-all active:scale-95"
          >
            <Package className="w-4 h-4" /> Lacak Pesanan Saya
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 border border-stone-200 text-stone-700 font-semibold py-3 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>

        <p className="text-xs text-stone-400 mt-4">
          Email konfirmasi telah dikirim ke alamat email terdaftar Anda.
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-amber-800 border-t-transparent rounded-full animate-spin" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
