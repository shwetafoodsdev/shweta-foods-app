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

const timeLabels = [
  { key: "hours" as const, label: "Hours" },
  { key: "minutes" as const, label: "Minutes" },
  { key: "seconds" as const, label: "Seconds" },
];

const DealOfTheMonth = ({ product }: { product: DealProduct | null }) => {
  const target = useMemo(() => (product?.dealEndsAt ? new Date(product.dealEndsAt) : null), [product?.dealEndsAt]);
  /** Countdown uses `Date.now()`; server and client would disagree on first paint — only render after mount. */
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!target) {
      return;
    }
    setRemaining(getTimeParts(target));
    setMounted(true);
    const interval = setInterval(() => {
      setRemaining(getTimeParts(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (!product || !target) return null;

  return (
    <section className="section-shell my-14 grid gap-10 overflow-hidden p-8 md:grid-cols-2 md:items-center md:p-10">
      <div className="space-y-5">
        <div className="section-heading">Festive special pick</div>
        <h2 className="h2-bold text-foreground">Deal Of The Day</h2>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          Freshly prepared favorites, packed with the warmth of home and a little festive indulgence for your snack table.
        </p>
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">{product.brand}</p>
          <h3 className="text-3xl font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{product.name}</h3>
        </div>
        <div className="flex w-full flex-wrap items-center justify-start gap-4 text-left">
          <RatingStars value={product.rating} />
          <div className="text-left text-2xl font-bold text-accent">
            {formatCurrencyFromCents(product.price)}
          </div>
        </div>
        <div className="grid max-w-sm grid-cols-3 gap-4">
          {timeLabels.map(({ key, label }) => (
            <div key={label} className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-center shadow-sm">
              <div className="min-h-9 text-2xl font-bold tabular-nums text-foreground" aria-live={mounted ? "polite" : undefined}>
                {mounted ? (
                  String(remaining[key]).padStart(2, "0")
                ) : (
                  <span
                    className="inline-block h-8 w-10 animate-pulse rounded-md bg-muted"
                    aria-hidden
                  />
                )}
              </div>
              <div className="text-xs uppercase text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <Link href={`/products/${product.slug}`} className="inline-flex rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary">
          View Product
        </Link>
      </div>
      <div className="relative flex justify-center">
        <div className="warm-gradient absolute inset-4 rounded-[2rem] blur-2xl" />
        <Image
          src={product.images[0]}
          alt={product.name}
          width={360}
          height={300}
          className="relative h-[280px] w-auto object-contain"
        />
      </div>
    </section>
  );
};

export default DealOfTheMonth;
