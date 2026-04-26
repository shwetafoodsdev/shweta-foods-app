import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const CheckoutLoginPage = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/checkout/shipping");
  }

  return (
    <section>
      <h1 className="h2-bold">User Login</h1>
      <p className="text-muted-foreground mt-2">Please sign in to continue checkout.</p>
      <Link href="/sign-in?callbackUrl=/checkout/shipping" className="mt-4 inline-flex rounded bg-slate-900 px-4 py-2 text-white">
        Sign In
      </Link>
    </section>
  );
};

export default CheckoutLoginPage;
