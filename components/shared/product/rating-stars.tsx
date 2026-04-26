import { Star } from "lucide-react";

const RatingStars = ({ value }: { value: number }) => {
  const rating = Math.max(0, Math.min(5, value));
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`size-4 ${index < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-yellow-300"}`}
        />
      ))}
    </div>
  );
};

export default RatingStars;
