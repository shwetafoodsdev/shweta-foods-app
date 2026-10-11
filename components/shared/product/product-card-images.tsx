"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductCardImages = ({
  images,
  name,
  className,
}: {
  images: string[];
  name: string;
  className?: string;
}) => {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  // The card image sits inside a product link, so stop the click from navigating.
  const step = (direction: -1 | 1) => (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrent((index) => (index + direction + count) % count);
  };

  return (
    <div className="relative">
      <Image
        src={images[current]}
        alt={name}
        width={300}
        height={200}
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${className ?? ""}`}
        loading="lazy"
      />
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={step(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow transition hover:bg-background md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={step(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow transition hover:bg-background md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1" aria-hidden>
            {images.map((_, index) => (
              <span
                key={index}
                className={`size-1.5 rounded-full ${index === current ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductCardImages;
