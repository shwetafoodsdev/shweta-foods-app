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
    <Card className="flex h-full w-full max-w-sm flex-col overflow-hidden border border-border/35 bg-card shadow-sm ring-0">
      <Link
        href={href}
        className="group block min-w-0 flex-1 no-underline text-inherit outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-0"
      >
        <CardHeader className="m-0 p-0">
          <Image
            src={product.images[0]}
            alt=""
            width={300}
            height={200}
            className="h-[200px] w-full bg-white object-contain p-2"
            loading="lazy"
          />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-4 pb-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</div>
          <div className="line-clamp-2 text-lg font-semibold group-hover:underline">{product.name}</div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <RatingStars value={Number(product.rating)} />
            {product.stock > 0 ? (
              <p className="text-lg font-bold text-green-500">{formatCurrencyFromCents(Number(product.price))}</p>
            ) : (
              <p className="text-lg font-bold text-red-500">Out of Stock</p>
            )}
          </div>
        </CardContent>
      </Link>
      <div className="px-4 pb-3 pt-1">
        <ProductCardAddToCart productId={product.id} stock={product.stock} initialQty={cartQty} />
      </div>
    </Card>
  );
};

export default ProductCard;
