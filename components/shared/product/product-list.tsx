import ProductCard from "./product-cart";
import { Product } from "@/types";

const ProductList = ({
  data,
  title,
  limit,
  cartQtyByProductId = {},
}: {
  data: Product[];
  title?: string;
  limit?: number;
  /** Signed-in line quantities for cart, keyed by product id. */
  cartQtyByProductId?: Record<string, number>;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <section className="my-12">
      {title ? <h2 className="h2-bold mb-6 text-foreground">{title}</h2> : null}
      {limitedData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-4">
          {limitedData.map((product: Product) => (
            <ProductCard
              key={product.slug}
              product={product}
              cartQty={cartQtyByProductId[product.id] ?? 0}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No products found.</p>
      )}
    </section>
  );
};

export default ProductList;
