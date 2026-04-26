import CheckoutSteps from "@/components/shared/checkout/checkout-steps";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <CheckoutSteps />
      <div className="mt-8 max-w-2xl">{children}</div>
    </div>
  );
}
