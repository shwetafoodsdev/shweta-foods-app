import { getCheckoutState, savePaymentMethod } from "@/lib/actions/order.actions";
import { redirect } from "next/navigation";

const PaymentPage = async () => {
  const state = await getCheckoutState();
  const currentMethod = state?.paymentMethods === "cod" ? "cod" : "cod";

  async function onSubmit(formData: FormData) {
    "use server";
    await savePaymentMethod(formData);
    redirect("/checkout/place-order");
  }

  return (
    <section>
      <h1 className="h2-bold">Payment Method</h1>
      <p className="text-muted-foreground mt-1">Please select a payment method</p>
      <form action={onSubmit} className="mt-6 space-y-3">
        <input type="hidden" name="paymentMethod" value="cod" />
        <label className="flex items-center gap-2">
          <input type="radio" checked={currentMethod === "cod"} readOnly />
          Cash On Delivery
        </label>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">
          Continue
        </button>
      </form>
    </section>
  );
};

export default PaymentPage;
