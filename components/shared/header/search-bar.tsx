"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type CategoryOption = {
  name: string;
  count: number;
};

const SearchBar = ({ categories }: { categories: CategoryOption[] }) => {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (category !== "all") next.set("category", category);
    router.push(`/products${next.toString() ? `?${next.toString()}` : ""}`);
  };

  return (
    <form onSubmit={onSubmit} className="hidden lg:flex items-center gap-0 rounded-md border overflow-hidden w-full max-w-xl">
      <select
        className="h-10 border-r bg-background px-3 text-sm outline-none"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="all">All</option>
        {categories.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        className="h-10 flex-1 px-3 outline-none bg-background"
        placeholder="Search..."
      />
      <button type="submit" className="h-10 w-11 bg-slate-900 text-white flex items-center justify-center">
        <Search className="size-4" />
      </button>
    </form>
  );
};

export default SearchBar;
