"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ratingLabels: Record<number, string> = {
  0: "Tap a star to rate",
  1: "Very bad",
  2: "Bad",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

export default function Rating({
  value = 0,
  onChange,
}: {
  value?: number;
  onChange?: (value: number) => void;
}) {
  const [rating, setRating] = useState(value);
  const [hoverRating, setHoverRating] = useState(0);

  const activeRating = hoverRating || rating;

  const handleChange = (star: number) => {
    setRating(star);
    onChange?.(star);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div
        className="flex items-center gap-4"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= activeRating;

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${star}`}
            >
              <Star
                className={cn(
                  "size-9 stroke-[2.3] text-secondary transition-colors",
                  isActive && "fill-accent text-accent",
                )}
              />
            </button>
          );
        })}
      </div>

      <p className="text-sm font-medium text-accent">
        {ratingLabels[activeRating]}
      </p>
    </div>
  );
}
