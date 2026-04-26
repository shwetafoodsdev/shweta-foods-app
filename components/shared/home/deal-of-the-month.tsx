"use client";

import { formatCurrencyFromCents } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import RatingStars from "@/components/shared/product/rating-stars";

function getTimeParts(targetDate: Date) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

type DealProduct = {
  price: number;
  slug: string;
  name: string;
  brand: string;
  rating: number;
  images: string[];
  dealEndsAt: Date | null;
};

const DealOfTheMonth = ({ product }: { product: DealProduct | null }) => {
  const target = useMemo(() => (product?.dealEndsAt ? new Date(product.dealEndsAt) : null), [product?.dealEndsAt]);
  const [remaining, setRemaining] = useState(() => (target ? getTimeParts(target) : { hours: 0, minutes: 0, seconds: 0 }));

  useEffect(() => {
    if (!target) {
      return;
    }
    const interval = setInterval(() => {
      setRemaining(getTimeParts(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (!product || !target) return null;

  return (
    <section className="my-14 grid gap-6 md:grid-cols-2 md:items-center">
      <div className="space-y-4">
        <h2 className="h2-bold">Deal Of The Day</h2>
        {/* <p className="text-muted-foreground">
          Get ready for unbeatable savings and limited-time offers on your favorite product.
        </p> */}
        <div className="space-y-1">
          <p>{product.brand}</p>
          <h3 className="text-2xl font-semibold">{product.name}</h3>
        </div>
        <div className="flex w-full flex-wrap items-center justify-start gap-4 text-left">
          <RatingStars value={product.rating} />
          <div className="text-left font-bold text-green-700">
            {formatCurrencyFromCents(product.price)}
          </div>
        </div>
        <div className="grid max-w-sm grid-cols-3 gap-4">
          {[
            { label: "Hours", value: remaining.hours },
            { label: "Minutes", value: remaining.minutes },
            { label: "Seconds", value: remaining.seconds },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold">{String(item.value).padStart(2, "0")}</div>
              <div className="text-xs uppercase text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
        <Link href={`/products/${product.slug}`} className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-white">
          View Product
        </Link>
      </div>
      <div className="flex justify-center">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={360}
          height={300}
          className="h-[260px] w-auto object-contain"
        />
      </div>
    </section>
  );
};

export default DealOfTheMonth;
