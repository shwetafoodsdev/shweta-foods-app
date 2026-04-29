import CheckoutSteps from "@/components/shared/checkout/checkout-steps";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CheckoutSteps />
      <div className="mt-5 max-w-2xl">{children}</div>
    </div>
  );
}
