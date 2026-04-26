import Link from "next/link";
import { buildProductListUrl, type ProductListState } from "@/lib/product-list-url";
import { cn } from "@/lib/utils";

const PRICE_FILTERS = [
  { label: "Any", min: undefined, max: undefined },
  { label: "₹1 to ₹5,000", min: 1, max: 5000 },
  { label: "₹5,001 to ₹10,000", min: 5001, max: 10000 },
  { label: "₹10,001 to ₹20,000", min: 10001, max: 20000 },
  { label: "₹20,001 to ₹50,000", min: 20001, max: 50000 },
  { label: "₹50,001 to ₹1,00,000", min: 50001, max: 100000 },
] as const;

const RATING_FILTERS = [0, 4, 3, 2, 1] as const;

type Category = { name: string; count: number };

type Props = {
  categories: Category[];
  listState: ProductListState;
};

function isPriceFilterActive(
  listState: ProductListState,
  item: (typeof PRICE_FILTERS)[number]
): boolean {
  if (item.min === undefined && item.max === undefined) {
    return listState.minPrice === undefined && listState.maxPrice === undefined;
  }
  return listState.minPrice === item.min && listState.maxPrice === item.max;
}

function isRatingFilterActive(listState: ProductListState, item: (typeof RATING_FILTERS)[number]): boolean {
  if (item === 0) {
    return listState.minRating === undefined;
  }
  return listState.minRating === item;
}

const filterLinkClass = (active: boolean) =>
  cn(
    "block rounded-md px-2 py-1 -mx-2 text-left transition-colors hover:underline",
    active && "bg-muted font-semibold text-foreground"
  );

const ProductFilterSections = ({ categories, listState }: Props) => {
  const q = (next: Record<string, string | undefined>) => buildProductListUrl(listState, next);

  return (
    <>
      <div>
        <h3 className="mb-2 text-xl font-bold">Department</h3>
        <div className="space-y-1">
          <Link
            className={filterLinkClass(listState.category === "all")}
            href={q({ category: undefined, page: undefined })}
            aria-current={listState.category === "all" ? "true" : undefined}
          >
            Any
          </Link>
          {categories.map((item) => {
            const active = listState.category === item.name;
            return (
              <Link
                key={item.name}
                className={filterLinkClass(active)}
                href={q({ category: item.name, page: undefined })}
                aria-current={active ? "true" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xl font-bold">Price</h3>
        <div className="space-y-1">
          {PRICE_FILTERS.map((item) => {
            const active = isPriceFilterActive(listState, item);
            return (
              <Link
                key={item.label}
                className={filterLinkClass(active)}
                href={q({
                  minPrice: item.min?.toString(),
                  maxPrice: item.max?.toString(),
                  page: undefined,
                })}
                aria-current={active ? "true" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xl font-bold">Customer Ratings</h3>
        <div className="space-y-1">
          {RATING_FILTERS.map((item) => {
            const active = isRatingFilterActive(listState, item);
            return (
              <Link
                key={item === 0 ? "any" : item}
                className={filterLinkClass(active)}
                href={q({ minRating: item ? String(item) : undefined, page: undefined })}
                aria-current={active ? "true" : undefined}
              >
                {item ? `${item} stars & up` : "Any"}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProductFilterSections;
