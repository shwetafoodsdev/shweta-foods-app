'use client';

import { useActionState, useEffect } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { signInDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { toast } from "sonner";

const Label = LabelPrimitive.Root;

const CredentialsSigninForm = ({
  googleSignInEnabled,
  callbackUrl = "/",
}: {
  googleSignInEnabled?: boolean;
  callbackUrl?: string;
}) => {
    const [state, formAction, isPending] = useActionState(signInWithCredentials, null);

    useEffect(() => {
      if (state && !state.success) {
        toast.error(state.message);
      }
    }, [state]);

    return <form action={formAction} className="w-full">
        <div className="space-y-4">
            {googleSignInEnabled ? (
              <div className="space-y-3">
                <GoogleSignInButton enabled={!!googleSignInEnabled} callbackUrl={callbackUrl} />
                <p className="text-center text-xs text-muted-foreground">or continue with email</p>
              </div>
            ) : null}
            <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email:
                </Label>
                <Input className="mt-2" id='email' name='email' type='email' autoComplete='email' required defaultValue={signInDefaultValues.email}  placeholder="Enter your email" />
            </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password:
                </Label>
                <PasswordInput className="mt-2" id='password' name='password' autoComplete='current-password' required defaultValue={signInDefaultValues.password} placeholder="Enter your password"/>
            </div>
            <div>
                <Button type="submit" className="w-full" variant="default" disabled={isPending}>
                    Sign In
                </Button>
            </div>
            <div className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-blue-500 hover:underline">
                    Sign up
                </Link>
            </div>
        </div>

    </form>;
}
 
export default CredentialsSigninForm;
