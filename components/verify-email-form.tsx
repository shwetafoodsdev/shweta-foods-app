'use client';

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resendEmailVerification, verifyEmail } from "@/lib/actions/user.actions";
import { toast } from "sonner";

export default function VerifyEmailForm({ email, token }: { email: string; token: string }) {
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyEmail, null);
  const [resendState, resendAction, resendPending] = useActionState(resendEmailVerification, null);

  useEffect(() => {
    if (verifyState?.success) toast.success(verifyState.message);
    if (verifyState && !verifyState.success) toast.error(verifyState.message);
  }, [verifyState]);

  useEffect(() => {
    if (resendState?.success) toast.success(resendState.message);
  }, [resendState]);

  const canVerify = Boolean(email && token);

  return (
    <div className="space-y-3">
      <form action={verifyAction} className="space-y-3">
        <Input type="hidden" name="email" value={email} />
        <Input type="hidden" name="token" value={token} />

        <Button type="submit" className="w-full" disabled={!canVerify || verifyPending}>
          Verify email
        </Button>

        {!canVerify ? (
          <p className="text-sm text-destructive text-center">Invalid verification link.</p>
        ) : null}
      </form>

      <form action={resendAction} className="space-y-2">
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={email}
          placeholder="Enter your email to resend"
        />
        <Button type="submit" variant="secondary" className="w-full" disabled={resendPending}>
          Resend verification email
        </Button>
      </form>
    </div>
  );
}

