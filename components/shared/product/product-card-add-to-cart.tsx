"use client";

import { addToCart } from "@/lib/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuantityStepper from "./quantity-stepper";

type Props = {
  productId: string;
  stock: number;
  initialQty: number;
};

const ProductCardAddToCart = ({ productId, stock, initialQty }: Props) => {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  if (stock < 1) {
    return (
      <p className="text-center text-xs text-muted-foreground" aria-live="polite">
        Out of stock
      </p>
    );
  }

  if (initialQty > 0) {
    return (
      <div className="flex w-full justify-center py-0.5">
        <QuantityStepper compact productId={productId} qty={initialQty} max={stock} />
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 w-full min-h-9 rounded-lg border-border/50 bg-card px-3 text-xs font-medium text-foreground shadow-none transition-colors hover:bg-muted/50"
      disabled={adding}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (adding) return;
        setAdding(true);
        try {
          const result = await addToCart(productId, 1);
          if (result.success) {
            router.refresh();
            return;
          }
          window.alert(result.message ?? "Unable to add to cart.");
          if (result.requiresSignIn) {
            router.push("/sign-in");
          }
        } catch {
          window.alert("Something went wrong. Please try again.");
        } finally {
          setAdding(false);
        }
      }}
    >
      {adding ? "Adding…" : "Add to cart"}
    </Button>
  );
};

export default ProductCardAddToCart;
