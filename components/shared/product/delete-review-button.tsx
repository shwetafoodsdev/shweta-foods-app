"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteReview } from "@/lib/actions/review.actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("Delete your review? This cannot be undone.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteReview(reviewId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
      disabled={pending}
      onClick={handleDelete}
      aria-label="Delete your review"
    >
      <Trash2 className="size-4" aria-hidden />
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
