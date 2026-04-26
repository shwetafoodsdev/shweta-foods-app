"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, SunMoonIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeMenuItems } from "./theme-menu-items";

const ModeToggle = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-9 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 shadow-none outline-none hover:bg-muted"
          aria-label="Theme and appearance"
        >
          {!mounted || theme === "system" ? (
            <SunMoonIcon className="h-5 w-5" />
          ) : theme === "light" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 min-w-52 p-0.5 border bg-white shadow-lg dark:bg-gray-900"
        >
          <ThemeMenuItems defaultOpen />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default ModeToggle;
