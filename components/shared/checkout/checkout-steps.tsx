"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { label: "User Login", href: "/checkout/login" },
  { label: "Shipping Address", href: "/checkout/shipping" },
  { label: "Payment Method", href: "/checkout/payment" },
  { label: "Place Order", href: "/checkout/place-order" },
];

const CheckoutSteps = () => {
  const pathname = usePathname();
  const activeIndex = steps.findIndex((step) => pathname === step.href);

  return (
    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
      {steps.map((step, index) => {
        const isActive = pathname === step.href;
        const isAccessible = activeIndex === -1 || index <= activeIndex;
        const className = `rounded-full border py-2 text-center font-medium transition ${
          isActive
            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
            : isAccessible
              ? "border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              : "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/60"
        }`;

        if (!isAccessible) {
          return (
            <span key={step.href} className={className} aria-disabled="true">
              {step.label}
            </span>
          );
        }

        return (
          <Link
            key={step.href}
            href={step.href}
            className={className}
          >
            {step.label}
          </Link>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
