import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import VerifyEmailForm from "@/components/verify-email-form";

export const metadata: Metadata = {
  title: "Verify Email",
  description: `Verify your ${APP_NAME} account email.`,
};

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const sp = await searchParams;
  const rawEmail = sp.email;
  const rawToken = sp.token;
  const email = (Array.isArray(rawEmail) ? rawEmail[0] : rawEmail) ?? "";
  const token = (Array.isArray(rawToken) ? rawToken[0] : rawToken) ?? "";

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="w-full">
        <CardHeader className="space-y-1 px-6 pt-4 pb-0">
          <Link href="/" className="flex justify-center">
            <Image
              src="/images/official-logo.png"
              alt={`${APP_NAME} logo`}
              width={160}
              height={90}
              className="h-auto w-32 object-contain"
              priority
            />
          </Link>
          <CardTitle className="text-center">Verify your email</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Confirm your email to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pb-8">
          <VerifyEmailForm email={email} token={token} />
          <div className="text-sm text-center text-muted-foreground">
            Already verified?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;

