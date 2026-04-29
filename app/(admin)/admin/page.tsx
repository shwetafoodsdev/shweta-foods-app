import { getAdminDashboardStats } from "@/lib/actions/admin.actions";
import { formatCurrencyFromCents, formatDisplayId } from "@/lib/format";
import Link from "next/link";

type AdminDashboardOrder = Awaited<ReturnType<typeof getAdminDashboardStats>>["orders"][number];

const AdminDashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const [stats, params] = await Promise.all([getAdminDashboardStats(), searchParams]);
  const q = params.q?.trim().toLowerCase() ?? "";
  const orders = q
    ? stats.orders.filter((order: AdminDashboardOrder) =>
        [
          order.id,
          formatDisplayId("ORD", order.id),
          order.user.name ?? "",
          order.user.email ?? "",
          formatCurrencyFromCents(order.totalPrice),
          order.deliveredAt ? "delivered" : "not delivered",
        ].some((value) => value.toLowerCase().includes(q))
      )
    : stats.orders;
  const undeliveredOrders = orders.filter((order: AdminDashboardOrder) => !order.deliveredAt);

  return (
    <div className="space-y-6">
      <h1 className="h1-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded border p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold">{formatCurrencyFromCents(stats.revenue)}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-muted-foreground">Sales</p>
          <p className="text-3xl font-bold">{stats.orders.length}</p>
        </div>
        <Link href="/admin/users" className="rounded border p-4 block">
          <p className="text-sm text-muted-foreground">Customers</p>
          <p className="text-3xl font-bold">{stats.users}</p>
        </Link>
        <div className="rounded border p-4">
          <p className="text-sm text-muted-foreground">Products</p>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>
      </div>
      <div>
        <h2 className="h3-bold mb-4">Not Delivered Orders</h2>
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
            {undeliveredOrders.length ? undeliveredOrders.map((order: AdminDashboardOrder) => (
              <div key={order.id} className="grid grid-cols-[110px_1fr_140px_120px_140px_100px] gap-3 border-t p-3 text-sm items-center">
                <span>{formatDisplayId("ORD", order.id)}</span>
                <span className="truncate">{order.user.name || order.user.email}</span>
                <span>{order.createdAt.toLocaleDateString()}</span>
                <span>{formatCurrencyFromCents(order.totalPrice)}</span>
                <span>Not delivered</span>
                <Link href={`/admin/orders/${order.id}`} className="underline">
                  Details
                </Link>
              </div>
            )) : <div className="border-t p-4 text-sm text-muted-foreground">No not-delivered orders match your search.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
