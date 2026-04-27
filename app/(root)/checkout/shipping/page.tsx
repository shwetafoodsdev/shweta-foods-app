import { getCheckoutState, saveShippingAddress } from "@/lib/actions/order.actions";
import { redirect } from "next/navigation";
import ShippingAddressForm from "@/components/shared/checkout/shipping-address-form";

const ShippingPage = async () => {
  const state = await getCheckoutState();
  const shipping = (state?.address || {}) as Record<string, string>;

  async function onSubmit(
    _prevState: { success: boolean; message?: string } | null,
    formData: FormData
  ) {
    "use server";
    const result = await saveShippingAddress(formData);
    if (result.success) {
      redirect("/checkout/payment");
    }
    return result;
  }

  return (
    <section>
      <h1 className="h2-bold">Shipping Address</h1>
      <p className="text-muted-foreground mt-1">Please enter an address to ship to</p>
      <ShippingAddressForm action={onSubmit} initialShipping={shipping} />
    </section>
  );
};

export default ShippingPage;
