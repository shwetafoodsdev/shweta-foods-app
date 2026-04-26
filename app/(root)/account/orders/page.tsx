import { getMyOrders } from "@/lib/actions/order.actions";
import { formatCurrencyFromCents, formatDisplayId } from "@/lib/format";
import Link from "next/link";

type MyOrder = Awaited<ReturnType<typeof getMyOrders>>[number];

const AccountOrdersPage = async () => {
  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <div className="mt-8">
        <h1 className="h2-bold mb-4">Order History</h1>
        <div className="mx-auto w-full max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm md:p-10 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">No Orders Yet</h2>
          <p className="text-muted-foreground text-lg">
            You have not placed any orders so far.
          </p>
          <p className="text-sm text-muted-foreground">
            Start exploring products and place your first order.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h1 className="h2-bold mb-4">Order History</h1>
      <div className="rounded border overflow-hidden">
        <div className="grid grid-cols-4 gap-3 border-b bg-muted/40 p-3 text-sm font-medium">
          <span>ID</span>
          <span>Date</span>
          <span>Total</span>
          <span>Action</span>
        </div>
        {orders.map((order: MyOrder) => (
          <div key={order.id} className="grid grid-cols-4 gap-3 p-3 border-b last:border-b-0">
            <span>{formatDisplayId("ORD", order.id)}</span>
            <span>{order.createdAt.toLocaleDateString()}</span>
            <span>{formatCurrencyFromCents(order.totalPrice)}</span>
            <Link href={`/order/${order.id}`} className="underline">
              Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountOrdersPage;
