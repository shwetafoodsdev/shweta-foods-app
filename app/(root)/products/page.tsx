import { getFilteredProducts, getProductCategories } from "@/lib/actions/product.actions";
import ProductCard from "@/components/shared/product/product-cart";
import Link from "next/link";

const PRICE_FILTERS = [
  { label: "Any", min: undefined, max: undefined },
  { label: "₹1 to ₹5,000", min: 1, max: 5000 },
  { label: "₹5,001 to ₹10,000", min: 5001, max: 10000 },
  { label: "₹10,001 to ₹20,000", min: 10001, max: 20000 },
  { label: "₹20,001 to ₹50,000", min: 20001, max: 50000 },
  { label: "₹50,001 to ₹1,00,000", min: 50001, max: 100000 },
];

const RATING_FILTERS = [0, 4, 3, 2, 1];

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await searchParams;
  const q = (params.q as string) ?? "";
  const category = (params.category as string) ?? "all";
  const sort = (params.sort as string) ?? "newest";
  const minPrice = params.minPrice ? Number(params.minPrice as string) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice as string) : undefined;
  const minRating = params.minRating ? Number(params.minRating as string) : undefined;
  const page = params.page ? Number(params.page as string) : 1;

  const [categories, result] = await Promise.all([
    getProductCategories(),
    getFilteredProducts({ q, category, sort, minPrice, maxPrice, minRating, page }),
  ]);

  const queryFor = (next: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    const merged = {
      q: q || undefined,
      category: category !== "all" ? category : undefined,
      sort: sort !== "newest" ? sort : undefined,
      minPrice: minPrice?.toString(),
      maxPrice: maxPrice?.toString(),
      minRating: minRating?.toString(),
      page: page > 1 ? page.toString() : undefined,
      ...next,
    };

    Object.entries(merged).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    return `/products${query.toString() ? `?${query.toString()}` : ""}`;
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-6">
        <div>
          <h3 className="font-bold text-xl mb-2">Department</h3>
          <div className="space-y-1">
            <Link className="block font-semibold" href={queryFor({ category: undefined, page: undefined })}>
              Any
            </Link>
            {categories.map((item) => (
              <Link
                key={item.name}
                className="block hover:underline"
                href={queryFor({ category: item.name, page: undefined })}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-xl mb-2">Price</h3>
          <div className="space-y-1">
            {PRICE_FILTERS.map((item) => (
              <Link
                key={item.label}
                className="block hover:underline"
                href={queryFor({
                  minPrice: item.min?.toString(),
                  maxPrice: item.max?.toString(),
                  page: undefined,
                })}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-xl mb-2">Customer Ratings</h3>
          <div className="space-y-1">
            {RATING_FILTERS.map((item) => (
              <Link
                key={item}
                className="block hover:underline"
                href={queryFor({ minRating: item ? String(item) : undefined, page: undefined })}
              >
                {item ? `${item} stars & up` : "Any"}
              </Link>
            ))}
          </div>
        </div>
      </aside>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Category: {category === "all" ? "Any" : category}{" "}
            <Link className="ml-2 underline" href="/products">
              Clear
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort By:</span>
            {["newest", "lowest", "highest", "rating"].map((option) => (
              <Link key={option} className={sort === option ? "font-semibold" : ""} href={queryFor({ sort: option })}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {result.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
