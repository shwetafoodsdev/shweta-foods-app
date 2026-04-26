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
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {limitedData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center sm:justify-items-stretch">
          {limitedData.map((product: Product) => (
            <ProductCard
              key={product.slug}
              product={product}
              cartQty={cartQtyByProductId[product.id] ?? 0}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
