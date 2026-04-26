import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart />
            Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon />
            Sign In
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="!w-[60vw] !max-w-none bg-background pt-6 px-6 pb-6 flex flex-col gap-6"
          >
            <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>

            <div className="flex flex-col gap-4 w-full">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <ModeToggle />
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <Link href="/cart">
                  <ShoppingCart /> Cart
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <Link href="/sign-in">
                  <UserIcon /> Sign In
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};


export default Menu;
