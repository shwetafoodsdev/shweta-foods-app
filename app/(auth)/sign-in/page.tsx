import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import CredentialsSigninForm from "@/components/credentials-signin-form";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Sign In",
    description: `Sign in to your ${APP_NAME} account.`,
};

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const sp = await searchParams;
  const raw = sp.callbackUrl;
  const fromQuery = Array.isArray(raw) ? raw[0] : raw;
  const callbackUrl =
    fromQuery && fromQuery.startsWith("/") && !fromQuery.startsWith("//") ? fromQuery : "/";
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()
  );

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
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 px-6 pb-8">
          <CredentialsSigninForm googleSignInEnabled={googleEnabled} callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
};
 
export default SignInPage;
