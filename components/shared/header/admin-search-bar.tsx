"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

const AdminSearchBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const { targetPath, placeholder } = useMemo(() => {
    if (pathname.startsWith("/admin/products")) {
      return { targetPath: "/admin/products", placeholder: "Search products..." };
    }

    if (pathname.startsWith("/admin/orders")) {
      return { targetPath: "/admin/orders", placeholder: "Search orders..." };
    }

    if (pathname.startsWith("/admin/users")) {
      return { targetPath: "/admin/users", placeholder: "Search users..." };
    }

    return { targetPath: "/admin", placeholder: "Search recent sales..." };
  }, [pathname]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) {
      next.set("q", query.trim());
    }
    router.push(`${targetPath}${next.toString() ? `?${next.toString()}` : ""}`);
  };

  return (
    <form onSubmit={onSubmit} className="hidden md:flex items-center overflow-hidden rounded border bg-background">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-9 w-52 px-3 text-sm outline-none"
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="flex h-9 w-10 items-center justify-center border-l bg-slate-900 text-white"
        aria-label="Search admin section"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
};

export default AdminSearchBar;
