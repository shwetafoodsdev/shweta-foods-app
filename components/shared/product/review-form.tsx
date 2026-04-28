"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReviewFormProps = {
  productId: string;
  action: (formData: FormData) => void | Promise<void>;
};

export default function ReviewForm({ productId, action }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <form action={action} className="mt-6 space-y-4 rounded-[1.5rem] border border-border/70 bg-card/90 p-5 shadow-sm">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <h3 className="font-semibold text-foreground">Write a review</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap a star to rate this product. Minimum rating is 1 star.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Your rating</label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            const activeValue = hovered ?? rating;
            const active = value <= activeValue;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(null)}
                className="rounded-full p-1 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                aria-pressed={rating === value}
              >
                <Star
                  className={`size-7 transition-colors ${
                    active ? "fill-primary text-primary" : "text-muted-foreground/40"
                  }`}
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm font-medium text-foreground">{rating}/5</span>
        </div>
      </div>

      <input
        className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 outline-none transition-colors focus:border-primary/50"
        name="title"
        placeholder="Review title"
      />
      <textarea
        className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 outline-none transition-colors focus:border-primary/50"
        name="comment"
        rows={4}
        placeholder="Share your experience"
      />
      <Button type="submit" className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-secondary">
        Submit Review
      </Button>
    </form>
  );
}
