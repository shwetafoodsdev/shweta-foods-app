"use client";

import { deleteAdminProduct } from "@/lib/actions/admin.actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type DeleteProductButtonProps = {
  productId: string;
  hasOrderHistory: boolean;
  disabled?: boolean;
};

export default function DeleteProductButton({
  productId,
  hasOrderHistory,
  disabled = false,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    const message = hasOrderHistory
      ? "This product was already used in orders. Deleting will mark it unavailable and remove it from carts. Continue?"
      : "Are you sure you want to delete this product?";

    if (!window.confirm(message)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminProduct(productId);
      if (result.success) {
        toast.success(result.message ?? "Product updated.");
        router.refresh();
      } else {
        toast.error(result.message ?? "Unable to delete product.");
      }
    });
  };

  return (
    <button
      type="button"
      disabled={disabled || pending}
      title={
        disabled
          ? "Unavailable while sample fallback data is shown"
          : hasOrderHistory
            ? "Mark unavailable (keeps order history)"
            : "Delete product"
      }
      onClick={onDelete}
      className="rounded bg-red-600 px-2 py-1 text-white disabled:cursor-not-allowed disabled:bg-red-300"
    >
      {pending ? "Working..." : "Delete"}
    </button>
  );
}
