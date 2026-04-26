import { getDealProduct, getLatestProducts } from "@/lib/actions/product.actions";
import { getCartQtyByProductIds } from "@/lib/actions/cart.actions";
import ProductList from "@/components/shared/product/product-list";
import Link from "next/link";
import DealOfTheMonth from "@/components/shared/home/deal-of-the-month";
import HomeFeatureStrip from "@/components/shared/home/home-feature-strip";

type LatestProduct = Awaited<ReturnType<typeof getLatestProducts>>[number];

const Homepage = async () => {
  const products = await getLatestProducts();
  const [dealProduct, cartQtyByProductId] = await Promise.all([
    getDealProduct(),
    getCartQtyByProductIds(products.map((p: LatestProduct) => p.id)),
  ]);
  const dealProductData = dealProduct
    ? {
        slug: dealProduct.slug,
        name: dealProduct.name,
        brand: dealProduct.brand,
        rating: Number(dealProduct.rating),
        images: dealProduct.images,
        price: Number(dealProduct.price),
        dealEndsAt: dealProduct.dealEndsAt,
      }
    : null;

  return (
    <>
      <DealOfTheMonth product={dealProductData} />
      <ProductList
        data={products}
        title="Shop snacks & savouries"
        cartQtyByProductId={cartQtyByProductId}
      />
      <div className="flex justify-center">
        <Link href="/products" className="rounded-md bg-slate-900 px-6 py-2 text-white">
          View All Products
        </Link>
      </div>
      <HomeFeatureStrip />
    </>
  );
};

export default Homepage;
