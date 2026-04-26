"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

type CategoryOption = {
  name: string;
  count: number;
};

const CategorySheet = ({ categories }: { categories: CategoryOption[] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] bg-background px-6 py-6">
        <SheetTitle className="text-xl font-bold">Select a category</SheetTitle>
        <div className="mt-6 space-y-2">
          {categories.map((item) => (
            <Link
              key={item.name}
              href={`/products?category=${encodeURIComponent(item.name)}`}
              className="block rounded-md px-3 py-2 hover:bg-muted"
            >
              {item.name} ({item.count})
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySheet;
