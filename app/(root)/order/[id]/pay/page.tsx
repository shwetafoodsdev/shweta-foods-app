import { getOrderById } from "@/lib/actions/order.actions";
import { formatDisplayId } from "@/lib/format";
import { notFound } from "next/navigation";

const OrderPayPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mt-8 max-w-xl rounded border p-6">
      <h1 className="h2-bold mb-2">Stripe Checkout</h1>
      <p className="text-muted-foreground">
        Stripe payment flow will be completed in the next phase. For now, use Cash On Delivery or admin-paid orders.
      </p>
      <p className="mt-4 text-sm">Order: {formatDisplayId("ORD", order.id)}</p>
    </div>
  );
};

export default OrderPayPage;
