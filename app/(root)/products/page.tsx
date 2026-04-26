import { getFilteredProducts, getProductCategories } from "@/lib/actions/product.actions";
import { getCartQtyByProductIds } from "@/lib/actions/cart.actions";
import ProductCard from "@/components/shared/product/product-cart";
import ProductFilterSections from "@/components/shared/product/product-filter-sections";
import ProductFiltersSheet from "@/components/shared/product/product-filters-sheet";
import { buildProductListUrl, type ProductListState } from "@/lib/product-list-url";
import Link from "next/link";
import { Suspense } from "react";

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

  const listState: ProductListState = { q, category, sort, minPrice, maxPrice, minRating, page };

  const cartQtyByProductId = await getCartQtyByProductIds(result.data.map((p) => p.id));

  const queryFor = (next: Record<string, string | undefined>) => buildProductListUrl(listState, next);

  return (
    <div className="mt-8 lg:grid lg:grid-cols-[220px_1fr] lg:items-start lg:gap-6">
      <section className="min-w-0 lg:col-start-2 lg:row-start-1">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Suspense
              fallback={
                <div
                  className="h-8 w-[5.5rem] shrink-0 rounded-md border border-dashed border-transparent bg-muted/40 lg:hidden"
                  aria-hidden
                />
              }
            >
              <ProductFiltersSheet>
                <ProductFilterSections categories={categories} listState={listState} />
              </ProductFiltersSheet>
            </Suspense>
            <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span>
                Category: {category === "all" ? "Any" : category}
              </span>
              {minPrice != null &&
                maxPrice != null &&
                !Number.isNaN(minPrice) &&
                !Number.isNaN(maxPrice) && (
                  <>
                    <span className="text-muted-foreground/80" aria-hidden>
                      ·
                    </span>
                    <span className="text-foreground">
                      Price: ₹{minPrice.toLocaleString("en-IN")} – ₹{maxPrice.toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              {minRating != null && !Number.isNaN(minRating) && (
                <>
                  <span className="text-muted-foreground/80" aria-hidden>
                    ·
                  </span>
                  <span className="text-foreground">Rating: {minRating}★ and up</span>
                </>
              )}
              {q.trim() ? (
                <>
                  <span className="text-muted-foreground/80" aria-hidden>
                    ·
                  </span>
                  <span className="min-w-0 max-w-[12rem] truncate text-foreground sm:max-w-none" title={q.trim()}>
                    &ldquo;{q.trim()}&rdquo;
                  </span>
                </>
              ) : null}
              <Link className="ml-0.5 shrink-0 font-medium text-foreground underline" href="/products">
                Clear
              </Link>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
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
            <ProductCard
              key={product.id}
              product={product}
              cartQty={cartQtyByProductId[product.id] ?? 0}
            />
          ))}
        </div>
      </section>
      <aside className="hidden space-y-6 lg:col-start-1 lg:row-start-1 lg:block">
        <ProductFilterSections categories={categories} listState={listState} />
      </aside>
    </div>
  );
};

export default ProductsPage;
