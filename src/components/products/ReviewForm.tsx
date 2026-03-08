'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StarRating from '@/components/ui/StarRating';
import { Review } from '@/lib/types';

interface ReviewFormProps {
  productId: string;
  userName: string;
  onSubmit: (review: Review) => void;
}

export default function ReviewForm({ productId, userName, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);

    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 600));

    const newReview: Review = {
      id: uuidv4(),
      product_id: productId,
      user_name: userName,
      rating,
      comment: comment.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    onSubmit(newReview);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl text-center">
        <p className="text-green-700 font-medium">✅ Terima kasih atas ulasan Anda!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t border-stone-100 pt-6">
      <h3 className="font-semibold text-stone-800 mb-4">Tulis Ulasan</h3>

      <div className="mb-4">
        <label className="block text-sm text-stone-600 mb-2">Rating Anda *</label>
        <StarRating
          rating={rating}
          interactive
          onRate={setRating}
          size="lg"
        />
        {rating === 0 && (
          <p className="text-xs text-stone-400 mt-1">Klik bintang untuk memberi rating</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm text-stone-600 mb-2">Ulasan Anda (opsional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pendapat Anda tentang item ini..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm resize-none focus:border-amber-500 bg-white"
        />
        <p className="text-xs text-stone-400 mt-1 text-right">{comment.length}/500</p>
      </div>

      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="px-6 py-2.5 bg-amber-800 text-white text-sm font-semibold rounded-xl hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
      >
        {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
      </button>
    </form>
  );
}
