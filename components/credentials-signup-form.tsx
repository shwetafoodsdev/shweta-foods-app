'use client';

import { useActionState } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useEffect } from "react";

const Label = LabelPrimitive.Root;

const CredentialsSignupForm = () => {
  const [state, formAction, isPending] = useActionState(signUpUser, null);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="w-full">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name: *
          </Label>
          <Input className="mt-2" id="name" name="name" required placeholder="Enter your name" />
        </div>
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </Label>
          <Input className="mt-2" id="email" name="email" type="email" required placeholder="Enter your email" />
        </div>
        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password:
          </Label>
          <PasswordInput className="mt-2" id="password" name="password" required placeholder="Create a password" />
        </div>
        <div>
          <Button type="submit" className="w-full" disabled={isPending}>
            Create Account
          </Button>
        </div>
        {state?.success ? (
          <p className="text-sm text-muted-foreground text-center">
            {state.message}{" "}
            <Link href="/verify-email" className="text-blue-500 hover:underline">
              Verify email
            </Link>
          </p>
        ) : null}
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignupForm;
