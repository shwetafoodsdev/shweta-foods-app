"use client";

import { addToCart } from "@/lib/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { InlineSpinner } from "@/components/ui/inline-spinner";
import { useState } from "react";
import { toast } from "sonner";
import QuantityStepper from "./quantity-stepper";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AddToCartSection = ({
  productId,
  stock,
  currentQty,
}: {
  productId: string;
  stock: number;
  currentQty: number;
}) => {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  if (currentQty > 0) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <QuantityStepper productId={productId} qty={currentQty} max={stock} />
        </div>
        <Button asChild className="w-full rounded-full">
          <Link href="/cart">Go to Cart</Link>
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full gap-2 rounded-full"
      disabled={adding || stock < 1}
      aria-busy={adding}
      onClick={async () => {
        if (adding) return;
        setAdding(true);
        try {
          const result = await addToCart(productId, 1);
          if (result.success) {
            toast.success("Added to cart");
            router.refresh();
            return;
          }
          toast.error(result.message ?? "Unable to add to cart.");
          if (result.requiresSignIn) {
            router.push("/sign-in");
          }
        } catch {
          toast.error("Something went wrong. Please try again.");
        } finally {
          setAdding(false);
        }
      }}
    >
      {adding ? (
        <>
          <InlineSpinner className="size-4" />
          Adding…
        </>
      ) : (
        "+ Add to Cart"
      )}
    </Button>
  );
};

export default AddToCartSection;
