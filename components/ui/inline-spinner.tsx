import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/** Small loading indicator for buttons and inline actions. */
export function InlineSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-3.5 shrink-0 animate-spin", className)} aria-hidden />;
}
