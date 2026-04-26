"use client";

import { updateCartItemQty } from "@/lib/actions/cart.actions";
import { Minus, Plus } from "lucide-react";
import { useTransition } from "react";

const QuantityStepper = ({
  productId,
  qty,
  max,
}: {
  productId: string;
  qty: number;
  max: number;
}) => {
  const [isPending, startTransition] = useTransition();

  const onUpdate = (nextQty: number) => {
    startTransition(async () => {
      const result = await updateCartItemQty(productId, nextQty);
      if (!result.success) {
        window.alert(result.message ?? "Unable to update cart.");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => onUpdate(qty - 1)}
        className="rounded border px-3 py-1"
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-6 text-center">{qty}</span>
      <button
        type="button"
        disabled={isPending || qty >= max}
        onClick={() => onUpdate(qty + 1)}
        className="rounded border px-3 py-1"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
};

export default QuantityStepper;
