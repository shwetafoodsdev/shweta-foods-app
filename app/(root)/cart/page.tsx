import { auth } from "@/auth";
import { getCartSummary } from "@/lib/actions/cart.actions";
import { formatCurrencyFromCents } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import QuantityStepper from "@/components/shared/product/quantity-stepper";

function EmptyCartCard() {
  return (
    <div className="mx-auto mt-4 w-full max-w-2xl rounded-3xl border bg-card px-8 py-10 text-center shadow-sm">
      <h2 className="text-3xl font-bold tracking-tight">Your cart is empty</h2>
      <p className="mt-5 text-lg text-muted-foreground">
        You have not added any products yet.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Start exploring products and add your favorites to cart.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

const CartPage = async () => {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mt-8">
        <h1 className="h2-bold mb-4">Shopping Cart</h1>
        <p className="mt-4 text-muted-foreground">
          Please <Link className="underline" href="/sign-in">sign in</Link> to view your cart.
        </p>
      </div>
    );
  }

  let summary;
  try {
    summary = await getCartSummary();
  } catch {
    return (
      <div className="mt-8">
        <h1 className="h2-bold mb-4">Shopping Cart</h1>
        <EmptyCartCard />
      </div>
    );
  }

  if (summary.items.length === 0) {
    return (
      <div className="mt-8">
        <h1 className="h2-bold mb-4">Shopping Cart</h1>
        <EmptyCartCard />
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="h2-bold mb-4">Shopping Cart</h1>
        <div className="rounded-lg border p-4">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b pb-2 text-sm text-muted-foreground">
            <div>Item</div>
            <div>Quantity</div>
            <div>Price</div>
          </div>
          <div>
            {summary.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-3 py-4 border-b last:border-b-0 items-center">
                <div className="flex items-center gap-3">
                  <Image src={item.product.images[0]} alt={item.product.name} width={48} height={48} className="rounded object-cover" />
                  <Link href={`/products/${item.product.slug}`} className="hover:underline">
                    {item.product.name}
                  </Link>
                </div>
                <QuantityStepper productId={item.productId} qty={item.qty} max={item.product.stock} />
                <div className="text-right font-semibold">{formatCurrencyFromCents(item.product.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <aside>
        <div className="rounded-lg border p-4 space-y-4">
          <h2 className="h3-bold">
            Subtotal ({summary.totalItems}): {formatCurrencyFromCents(summary.subtotal)}
          </h2>
          <Link href="/checkout/login" className="block rounded-md bg-slate-900 text-white text-center py-2">
            Proceed to Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default CartPage;
