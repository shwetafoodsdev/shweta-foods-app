"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "lucide-react";
import { ThemeMenuItems } from "./theme-menu-items";

const UserMenu = ({ session }: { session: Session | null }) => {
  if (!session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="shrink-0 gap-2 rounded-full border border-border/70 bg-card/70 px-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
            aria-label="Account: appearance and sign in"
          >
            <User className="size-5 shrink-0" />
            <span className="hidden sm:inline">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="z-[100] !w-56 min-w-56 border bg-white shadow-lg dark:bg-gray-900"
        >
          <DropdownMenuItem asChild>
            <Link href="/sign-in">Sign in</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <ThemeMenuItems />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const initial = session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="size-11 rounded-full border border-border/70 bg-card/80 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open profile menu"
        >
          {initial.toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[100] !w-56 min-w-56 border bg-white shadow-lg dark:bg-gray-900"
      >
        <DropdownMenuLabel className="text-sm">
          <div className="font-semibold">{session.user.name || "User"}</div>
          <div className="text-xs text-muted-foreground">{session.user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session.user.role === "admin" ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/account/profile">User Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders">Order History</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeMenuItems />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
