import { getCartSummary } from "@/lib/actions/cart.actions";
import { getCheckoutState, placeOrder } from "@/lib/actions/order.actions";
import { formatCurrencyFromCents } from "@/lib/format";
import { calculateOrderCharges, getSiteSettings } from "@/lib/site-settings";
import Image from "next/image";
import { redirect } from "next/navigation";

type CartSummaryItem = Awaited<ReturnType<typeof getCartSummary>>["items"][number];

const PlaceOrderPage = async () => {
  const [summary, checkoutState, siteSettings] = await Promise.all([getCartSummary(), getCheckoutState(), getSiteSettings()]);
  const shipping = (checkoutState?.address || {}) as Record<string, string>;
  const { taxPrice, shippingPrice, totalPrice } = calculateOrderCharges(summary.subtotal, siteSettings);

  async function onPlaceOrder() {
    "use server";
    const result = await placeOrder();
    if (!result.success) return;
    redirect(`/order/${result.orderId}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <h1 className="h2-bold">Place Order</h1>
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p>{shipping.fullName}</p>
          <p>
            {shipping.address1}, {shipping.city} {shipping.postalCode}, {shipping.country}
          </p>
        </div>
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">Payment Method</h2>
          <p className="uppercase">{checkoutState?.paymentMethods || "cod"}</p>
        </div>
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-4">Order Items</h2>
          <div className="space-y-3">
            {summary.items.map((item: CartSummaryItem) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                <div className="flex items-center gap-3">
                  <Image src={item.product.images[0]} alt={item.product.name} width={42} height={42} className="rounded" />
                  <span>{item.product.name}</span>
                </div>
                <span>{item.qty}</span>
                <span>{formatCurrencyFromCents(item.product.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <aside>
        <div className="rounded border p-4 space-y-3">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{formatCurrencyFromCents(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({siteSettings.taxRate}%)</span>
            <span>{formatCurrencyFromCents(taxPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatCurrencyFromCents(shippingPrice)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrencyFromCents(totalPrice)}</span>
          </div>
          <form action={onPlaceOrder}>
            <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-white">
              Place Order
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default PlaceOrderPage;
