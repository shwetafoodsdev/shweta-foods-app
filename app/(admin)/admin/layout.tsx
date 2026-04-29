import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import UserMenu from "@/components/shared/header/user-menu";
import AdminSearchBar from "@/components/shared/header/admin-search-bar";
import { APP_NAME } from "@/lib/constants";
import { Suspense } from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/charges", label: "Charges" },
  ];

  return (
    <div>
      <header className="border-b">
        <div className="wrapper py-3 md:py-2">
          <div className="flex items-center gap-2 md:justify-between">
            <div className="flex min-w-0 items-center gap-4 md:gap-6">
              <Link href="/admin" className="flex shrink-0 items-center gap-2">
                <Image src="/images/logo.svg" alt={`${APP_NAME} logo`} width={28} height={28} />
              </Link>
              <nav className="hidden min-w-0 items-center gap-4 overflow-x-auto whitespace-nowrap text-sm md:flex">
                {links.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 md:ml-auto md:flex-none">
              <Suspense
                fallback={
                  <input
                    className="h-9 min-w-0 flex-1 rounded border px-3 text-sm md:w-52 md:flex-none"
                    placeholder="Search..."
                    disabled
                  />
                }
              >
                <AdminSearchBar />
              </Suspense>
              <UserMenu session={session} />
            </div>
          </div>
          <nav className="mt-3 flex items-center gap-4 overflow-x-auto whitespace-nowrap text-sm md:hidden">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="wrapper py-6">{children}</main>
    </div>
  );
}
