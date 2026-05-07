import { deleteAdminProduct, getAdminProducts } from "@/lib/actions/admin.actions";
import { formatCurrencyFromCents, formatDisplayId } from "@/lib/format";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/delete-product-button";

type AdminProduct = Awaited<ReturnType<typeof getAdminProducts>>["products"][number];

const AdminProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const [{ products, isFallback }, params] = await Promise.all([getAdminProducts(), searchParams]);
  const q = params.q?.trim().toLowerCase() ?? "";
  const visibleProducts = products.filter((product: AdminProduct) => product.isVisiable);
  const filteredProducts = q
    ? visibleProducts.filter((product: AdminProduct) =>
        [
          product.id,
          formatDisplayId("PRD", product.id),
          product.name,
          product.slug,
          product.category,
          product.brand,
        ].some((value) => value.toLowerCase().includes(q))
      )
    : visibleProducts;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="h2-bold">Products</h1>
        <Link href="/admin/products/new" className="rounded bg-slate-900 px-4 py-2 text-white">
          Create Product
        </Link>
      </div>
      {isFallback ? (
        <div className="mb-4 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The database is currently unreachable, so this page is showing sample products in read-only mode.
        </div>
      ) : null}
      <div className="overflow-x-auto rounded border">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[110px_1fr_110px_160px_90px_80px_130px_150px] gap-3 bg-muted/40 p-3 text-xs font-semibold uppercase">
            <span>ID</span>
            <span>Name</span>
            <span>Price</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Rating</span>
            <span>Deal</span>
            <span>Actions</span>
          </div>
          {filteredProducts.length ? filteredProducts.map((product: AdminProduct) => (
            <div key={product.id} className="grid grid-cols-[110px_1fr_110px_160px_90px_80px_130px_150px] gap-3 border-t p-3 items-center text-sm">
              <span>{formatDisplayId("PRD", product.id)}</span>
              <span className="truncate">{product.name}</span>
              <span>{formatCurrencyFromCents(product.price)}</span>
              <span>{product.category}</span>
              <span>{product.stock}</span>
              <span>{Number(product.rating)}</span>
              <span>
                {product.isDealOfDay && product.dealEndsAt && new Date(product.dealEndsAt) > new Date() ? (
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                    Deal of the Day
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  aria-disabled={isFallback}
                  className={`rounded border px-2 py-1 ${isFallback ? "pointer-events-none opacity-50" : ""}`}
                >
                  Edit
                </Link>
                <DeleteProductButton
                  productId={product.id}
                  hasOrderHistory={product._count.orderItems > 0}
                  disabled={isFallback}
                />
              </div>
            </div>
          )) : <div className="border-t p-4 text-sm text-muted-foreground">No products match your search.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
