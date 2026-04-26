"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function PasswordInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <Input {...props} type={showPassword ? "text" : "password"} className="pr-10" />
      <button
        type="button"
        onClick={() => setShowPassword((value) => !value)}
        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground transition hover:text-foreground"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export { PasswordInput };
