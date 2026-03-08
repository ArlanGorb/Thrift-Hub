import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export default function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onRate,
  size = 'md',
  showNumber = false,
}: StarRatingProps) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`${sizes[size]} ${
                filled ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
              } transition-colors`}
            />
          </button>
        );
      })}
      {showNumber && (
        <span className="text-sm text-stone-500 ml-1 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
