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
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

const UserMenu = ({ session }: { session: Session | null }) => {
  if (!session?.user) {
    return (
      <Button asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  const initial = session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="size-9 rounded-full border border-border bg-muted/80 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open profile menu"
        >
          {initial.toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[100] !w-56 min-w-56 bg-white dark:bg-gray-900 border shadow-lg"
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
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
