"use client";

import { addToCart } from "@/lib/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  if (currentQty > 0) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <QuantityStepper productId={productId} qty={currentQty} max={stock} />
        </div>
        <Button asChild className="w-full">
          <Link href="/cart">Go to Cart</Link>
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full"
      disabled={isPending || stock < 1}
      onClick={() =>
        startTransition(async () => {
          const result = await addToCart(productId, 1);
          if (!result.success) {
            window.alert(result.message ?? "Unable to add to cart.");
            if (result.requiresSignIn) {
              router.push("/sign-in");
            }
          }
        })
      }
    >
      + Add to Cart
    </Button>
  );
};

export default AddToCartSection;
