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
        <div className="wrapper flex-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/images/logo.svg" alt={`${APP_NAME} logo`} width={28} height={28} />
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {links.map((item) => (
                <Link key={item.href} href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Suspense
              fallback={
                <input
                  className="hidden md:block rounded border px-3 py-1 text-sm"
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
      </header>
      <main className="wrapper py-6">{children}</main>
    </div>
  );
}
