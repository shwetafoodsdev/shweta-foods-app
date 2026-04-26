"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export function AppToaster() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toasterTheme: "light" | "dark" =
    (theme === "system" ? resolvedTheme : theme) === "dark" ? "dark" : "light";

  return (
    <Toaster
      theme={toasterTheme}
      position="top-center"
      closeButton
      richColors
      duration={4_000}
    />
  );
}
