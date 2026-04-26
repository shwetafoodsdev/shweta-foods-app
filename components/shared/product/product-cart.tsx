import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/types";
import RatingStars from "./rating-stars";
import { formatCurrencyFromCents } from "@/lib/format";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardHeader className="p-0 m-0">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={200}
            className="object-contain w-full h-[200px] bg-white p-2"
            loading="lazy"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex flex-col justify-between h-[150px]">
        <div className="text-ts">{product.brand}</div>
        <Link
          href={`/products/${product.slug}`}
          className="text-lg font-semibold hover:underline"
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between mt-auto">
          <RatingStars value={Number(product.rating)} />
          {product.stock > 0 ? (
            <p className="text-green-500 text-lg font-bold">{formatCurrencyFromCents(Number(product.price))}</p>
          ) : (
            <p className="text-red-500 text-lg font-bold">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
