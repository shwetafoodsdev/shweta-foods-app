"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ChevronDown, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

const themes = [
  { id: "system" as const, label: "System", title: "Match system", Icon: SunMoonIcon },
  { id: "light" as const, label: "Light", title: "Light", Icon: SunIcon },
  { id: "dark" as const, label: "Dark", title: "Dark", Icon: MoonIcon },
] as const;

type ThemeMenuItemsProps = {
  /** In the profile menu, start collapsed to keep the list short. The theme-only dropdown (mode toggle) can open expanded. */
  defaultOpen?: boolean;
};

export function ThemeMenuItems({ defaultOpen = false }: ThemeMenuItemsProps = {}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-0.5 my-0.5 h-9 animate-pulse rounded-md bg-muted" aria-hidden />
    );
  }

  return (
    <div className="pt-0.5">
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onPointerDown={(e) => e.stopPropagation()}
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
      >
        <span className="font-medium">Appearance</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-1.5 pt-0.5 pb-1.5" inert={!open || undefined}>
            <div
              className="flex w-full min-w-0 max-w-52 items-stretch justify-center gap-0.5 rounded-md border border-border/60 bg-muted/40 p-0.5"
              role="toolbar"
              aria-label="Color scheme"
            >
              {themes.map(({ id, label, title, Icon }) => {
                const active = theme === id;
                return (
                  <button
                    key={id}
                    type="button"
                    title={title}
                    aria-pressed={active}
                    aria-label={label}
                    onClick={() => setTheme(id)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={cn(
                      "inline-flex h-8 min-w-0 flex-1 items-center justify-center rounded-[6px] text-foreground/80 transition-colors",
                      "hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                      active && "bg-background text-foreground shadow-sm"
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
