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
  compactMobile = false,
}: {
  product: Product;
  cartQty?: number;
  compactMobile?: boolean;
}) => {
  const href = `/products/${product.slug}`;

  return (
    <Card className="theme-surface soft-lift !gap-0 !py-0 flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-border/60 shadow-[0_12px_32px_rgba(93,64,55,0.08)] ring-0">
      <Link
        href={href}
        className="group block min-w-0 flex-1 no-underline text-inherit outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-0"
      >
        <CardHeader className="m-0 overflow-hidden p-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={200}
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              compactMobile ? "h-[140px] sm:h-[220px]" : "h-[220px]"
            }`}
            loading="lazy"
          />
        </CardHeader>
        <CardContent className={`flex flex-1 flex-col ${compactMobile ? "gap-2 p-3 pb-2 sm:gap-3 sm:p-5 sm:pb-3" : "gap-3 p-5 pb-3"}`}>
          <div className={`${compactMobile ? "text-sm sm:text-xl" : "text-xl"} line-clamp-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary`} style={{ fontFamily: "var(--font-heading)" }}>
            {product.name}
          </div>
          <p className={`${compactMobile ? "text-xs sm:text-sm" : "text-sm"} line-clamp-2 text-muted-foreground`}>{product.category}</p>
          <div className="mt-auto flex items-center justify-between gap-2">
            <RatingStars value={Number(product.rating)} />
            {product.stock > 0 ? (
              <p className={`${compactMobile ? "text-sm sm:text-xl" : "text-xl"} font-bold text-accent`}>{formatCurrencyFromCents(Number(product.price))}</p>
            ) : (
              <p className={`${compactMobile ? "text-xs sm:text-lg" : "text-lg"} font-bold text-destructive`}>Out of Stock</p>
            )}
          </div>
        </CardContent>
      </Link>
      <div className={compactMobile ? "px-3 pb-3 pt-1 sm:px-5 sm:pb-5" : "px-5 pb-5 pt-1"}>
        <ProductCardAddToCart productId={product.id} stock={product.stock} initialQty={cartQty} />
      </div>
    </Card>
  );
};

export default ProductCard;
