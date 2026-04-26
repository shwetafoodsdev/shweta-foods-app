"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

const ProductFiltersSheet = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    setOpen(false);
  }, [pathname, searchKey]);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5">
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100%,20rem)] gap-0 overflow-y-auto p-0 sm:max-w-sm">
          <SheetHeader className="border-b px-4 py-3 text-left">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 px-4 py-4">{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductFiltersSheet;
