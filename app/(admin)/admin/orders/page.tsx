import { getAdminOrders } from "@/lib/actions/order.actions";
import { formatCurrencyFromCents, formatDisplayId } from "@/lib/format";
import Link from "next/link";

type AdminOrder = Awaited<ReturnType<typeof getAdminOrders>>[number];

const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const [orders, params] = await Promise.all([getAdminOrders(), searchParams]);
  const q = params.q?.trim().toLowerCase() ?? "";
  const filteredOrders = q
    ? orders.filter((order: AdminOrder) =>
        [
          order.id,
          formatDisplayId("ORD", order.id),
          order.user.name ?? "",
          order.user.email ?? "",
          order.paymentMethod,
          order.deliveredAt ? "delivered" : "not delivered",
        ].some((value) => value.toLowerCase().includes(q))
      )
    : orders;

  return (
    <div>
      <h1 className="h2-bold mb-4">Orders</h1>
      <div className="overflow-x-auto rounded border">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[110px_1fr_140px_120px_140px_100px] gap-3 bg-muted/40 p-3 text-xs font-semibold uppercase">
            <span>ID</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {filteredOrders.length ? filteredOrders.map((order: AdminOrder) => (
            <div key={order.id} className="grid grid-cols-[110px_1fr_140px_120px_140px_100px] gap-3 border-t p-3 text-sm items-center">
              <span>{formatDisplayId("ORD", order.id)}</span>
              <span className="truncate">{order.user.name || order.user.email}</span>
              <span>{order.createdAt.toLocaleDateString()}</span>
              <span>{formatCurrencyFromCents(order.totalPrice)}</span>
              <span>{order.deliveredAt ? "Delivered" : "Not delivered"}</span>
              <Link href={`/admin/orders/${order.id}`} className="underline">
                Details
              </Link>
            </div>
          )) : <div className="border-t p-4 text-sm text-muted-foreground">No orders match your search.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
