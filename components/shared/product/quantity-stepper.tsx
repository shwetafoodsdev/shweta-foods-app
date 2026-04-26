"use client";

import { updateCartItemQty } from "@/lib/actions/cart.actions";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const QuantityStepper = ({
  productId,
  qty,
  max,
  compact = false,
}: {
  productId: string;
  qty: number;
  max: number;
  /** Smaller control for product cards on listing pages. */
  compact?: boolean;
}) => {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const onUpdate = async (nextQty: number) => {
    if (updating) return;
    setUpdating(true);
    try {
      const result = await updateCartItemQty(productId, nextQty);
      if (!result.success) {
        window.alert(result.message ?? "Unable to update cart.");
        return;
      }
      router.refresh();
    } catch {
      window.alert("Something went wrong. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const pad = compact ? "px-2 py-0.5" : "px-3 py-1";
  const iconSize = compact ? "h-3.5 w-3.5" : "size-4";
  const round = compact ? "rounded-lg" : "rounded-md";
  const compactTone = compact ? "border-border/50 bg-card hover:bg-muted/50" : "hover:bg-muted/80";

  return (
    <div className={compact ? "flex max-w-full items-center gap-1" : "flex items-center gap-2"}>
      <button
        type="button"
        disabled={updating}
        onClick={() => onUpdate(qty - 1)}
        className={cn("border transition-colors", pad, round, compactTone)}
      >
        <Minus className={iconSize} />
      </button>
      <span className={cn("min-w-6 text-center", compact && "text-xs")}>{qty}</span>
      <button
        type="button"
        disabled={updating || qty >= max}
        onClick={() => onUpdate(qty + 1)}
        className={cn("border transition-colors", pad, round, compactTone)}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
};

export default QuantityStepper;
