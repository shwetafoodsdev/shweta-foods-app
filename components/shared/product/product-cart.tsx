import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/types";
import RatingStars from "./rating-stars";
import { formatCurrencyFromCents } from "@/lib/format";
import ProductCardAddToCart from "./product-card-add-to-cart";

const ProductCard = ({
  product,
  cartQty = 0,
}: {
  product: Product;
  cartQty?: number;
}) => {
  const href = `/products/${product.slug}`;

  return (
    <Card className="soft-lift flex h-full w-full max-w-sm flex-col overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/95 shadow-[0_12px_32px_rgba(93,64,55,0.08)] ring-0">
      <Link
        href={href}
        className="group block min-w-0 flex-1 no-underline text-inherit outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-0"
      >
        <CardHeader className="m-0 p-0">
          <div className="warm-gradient relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_35%)]" />
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={200}
              className="relative h-[220px] w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 p-5 pb-3">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">{product.brand}</div>
          <div className="line-clamp-2 text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            {product.name}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.category}</p>
          <div className="mt-auto flex items-center justify-between gap-2">
            <RatingStars value={Number(product.rating)} />
            {product.stock > 0 ? (
              <p className="text-xl font-bold text-accent">{formatCurrencyFromCents(Number(product.price))}</p>
            ) : (
              <p className="text-lg font-bold text-destructive">Out of Stock</p>
            )}
          </div>
        </CardContent>
      </Link>
      <div className="px-5 pb-5 pt-1">
        <ProductCardAddToCart productId={product.id} stock={product.stock} initialQty={cartQty} />
      </div>
    </Card>
  );
};

export default ProductCard;
