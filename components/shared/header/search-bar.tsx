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
    <form
      onSubmit={onSubmit}
      className="flex w-full min-w-0 max-w-full flex-1 items-center gap-0 overflow-hidden rounded-md border sm:max-w-xl"
    >
      <select
        className="hidden h-9 shrink-0 border-r bg-background px-2 text-xs outline-none sm:block sm:h-10 sm:px-3 sm:text-sm"
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
        className="h-9 min-w-0 flex-1 bg-background px-2 text-sm outline-none sm:h-10 sm:px-3"
        placeholder="Search..."
      />
      <button
        type="submit"
        className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-900 text-white sm:h-10 sm:w-11"
        aria-label="Search"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
};

export default SearchBar;
