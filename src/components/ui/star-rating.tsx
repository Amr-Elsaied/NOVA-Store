import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number; 
}

export function StarRating({ rating, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star) {
          return <Star key={star} size={size} fill="currentColor" />;
        } else if (rating >= star - 0.5) {
          return <StarHalf key={star} size={size} fill="currentColor" />;
        } else {
          return <Star key={star} size={size} className="text-gray-300" />;
        }
      })}
      <span className="ml-2 text-xs text-muted-foreground dark:text-white">
        ({rating})
      </span>
    </div>
  );
}