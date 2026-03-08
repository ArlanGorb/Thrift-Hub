export interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number;       // percent: 0–100, fixed: IDR amount
  minOrder: number;    // minimum subtotal to apply
  description: string;
}

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'THRIFT10',
    type: 'percent',
    value: 10,
    minOrder: 0,
    description: 'Diskon 10% untuk semua produk',
  },
  {
    code: 'THRIFT20',
    type: 'percent',
    value: 20,
    minOrder: 200000,
    description: 'Diskon 20% untuk pembelian min. Rp200.000',
  },
  {
    code: 'HEMAT50K',
    type: 'fixed',
    value: 50000,
    minOrder: 300000,
    description: 'Potongan Rp50.000 untuk pembelian min. Rp300.000',
  },
  {
    code: 'NEWUSER',
    type: 'percent',
    value: 15,
    minOrder: 0,
    description: 'Diskon 15% untuk pengguna baru',
  },
];

export function applyPromoCode(
  code: string,
  subtotal: number
): { promo: PromoCode; discount: number } | { error: string } {
  const promo = PROMO_CODES.find((p) => p.code === code.toUpperCase().trim());
  if (!promo) return { error: 'Kode promo tidak valid' };
  if (subtotal < promo.minOrder) {
    return {
      error: `Minimum pembelian ${new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(promo.minOrder)} untuk kode ini`,
    };
  }
  const discount =
    promo.type === 'percent'
      ? Math.round((subtotal * promo.value) / 100)
      : Math.min(promo.value, subtotal);
  return { promo, discount };
}
