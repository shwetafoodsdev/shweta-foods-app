/**
 * Build `/products` URLs with query params (shared by products page and filter UI).
 */
export type ProductListState = {
  q: string;
  category: string;
  sort: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page: number;
};

export function buildProductListUrl(
  state: ProductListState,
  next: Record<string, string | undefined>
): string {
  const merged = {
    q: state.q || undefined,
    category: state.category !== "all" ? state.category : undefined,
    sort: state.sort !== "newest" ? state.sort : undefined,
    minPrice: state.minPrice?.toString(),
    maxPrice: state.maxPrice?.toString(),
    minRating: state.minRating?.toString(),
    page: state.page > 1 ? state.page.toString() : undefined,
    ...next,
  };

  const query = new URLSearchParams();
  Object.entries(merged).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return `/products${query.toString() ? `?${query.toString()}` : ""}`;
}
