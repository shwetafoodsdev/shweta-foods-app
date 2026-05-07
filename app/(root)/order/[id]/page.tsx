import { getOrderById } from "@/lib/actions/order.actions";
import { formatCurrencyFromCents, formatDisplayId } from "@/lib/format";
import { notFound } from "next/navigation";
import { markOrderDelivered } from "@/lib/actions/order.actions";
import { auth } from "@/auth";
import Link from "next/link";

type OrderItemWithProductVisibility = Awaited<ReturnType<typeof getOrderById>>["orderItems"][number];

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [order, session] = await Promise.all([getOrderById(id), auth()]);
  if (!order) notFound();

  async function onMarkDelivered() {
    "use server";
    await markOrderDelivered(id);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <h1 className="h2-bold">Order {formatDisplayId("ORD", order.id)}</h1>
        <div className="rounded border p-4">
          <h2 className="font-semibold">Payment Method</h2>
          <p className="uppercase">{order.paymentMethod}</p>
          {order.paymentMethod === "cod" ? (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs mt-2 ${
                order.deliveredAt ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {order.deliveredAt
                ? "Cash on delivery payment collected on delivery"
                : "Cash on delivery: payment due upon delivery"}
            </span>
          ) : order.paidAt ? (
            <span className="inline-flex rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs mt-2">
              Paid at {order.paidAt.toLocaleString()}
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs mt-2">Not paid</span>
          )}
          {!order.paidAt && order.paymentMethod === "stripe" ? (
            <div className="mt-3">
              <Link href={`/order/${order.id}/pay`} className="rounded bg-slate-900 px-3 py-1.5 text-white text-sm inline-block">
                Continue to Stripe Checkout
              </Link>
            </div>
          ) : null}
        </div>
        <div className="rounded border p-4">
          <h2 className="font-semibold">Shipping Address</h2>
          <p>{order.shippingFullName}</p>
          <p>
            {order.shippingAddress1}, {order.shippingCity} {order.shippingPostalCode}, {order.shippingCountry}
          </p>
          {order.deliveredAt ? (
            <span className="inline-flex rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs mt-2">
              Delivered
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs mt-2">
              Not delivered
            </span>
          )}
        </div>
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-3">Order Items</h2>
          <div className="space-y-2">
            {order.orderItems.map((item: OrderItemWithProductVisibility) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-3">
                <div>
                  <p>{item.name}</p>
                  {!item.product?.isVisiable ? (
                    <p className="text-xs text-muted-foreground">This product is unavailable.</p>
                  ) : null}
                </div>
                <p>{item.qty}</p>
                <p>{formatCurrencyFromCents(item.unitPrice)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <aside>
        <div className="rounded border p-4 space-y-2">
          <div className="flex justify-between"><span>Items</span><span>{formatCurrencyFromCents(order.itemsPrice)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>{formatCurrencyFromCents(order.taxPrice)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{formatCurrencyFromCents(order.shippingPrice)}</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrencyFromCents(order.totalPrice)}</span></div>
          {session?.user.role === "admin" && !order.deliveredAt ? (
            <form action={onMarkDelivered}>
              <button className="w-full rounded bg-slate-900 text-white py-2 mt-2">Mark As Delivered</button>
            </form>
          ) : null}
        </div>
      </aside>
    </div>
  );
};

export default OrderDetailsPage;
