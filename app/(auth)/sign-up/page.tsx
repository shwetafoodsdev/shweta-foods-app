import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import CredentialsSignupForm from "@/components/credentials-signup-form";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign Up",
  description: `Create your ${APP_NAME} account.`,
};

const SignUpPage = () => {
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
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign up to start shopping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 px-6 pb-8">
          <CredentialsSignupForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
