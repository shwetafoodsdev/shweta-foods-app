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
      className="flex w-full min-w-0 max-w-full flex-1 items-center gap-0 overflow-hidden rounded-full border border-border/70 bg-card/90 shadow-sm transition-all duration-300 focus-within:border-primary/60 focus-within:shadow-[0_0_0_4px_rgba(230,126,34,0.12)] sm:max-w-xl"
    >
      <select
        className="hidden h-11 shrink-0 border-r border-border/70 bg-transparent px-3 text-xs text-foreground outline-none sm:block sm:px-4 sm:text-sm"
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
        className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
        placeholder="Search for khakhra, namkeen, samosa..."
      />
      <button
        type="submit"
        className="m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-secondary sm:h-9 sm:w-9"
        aria-label="Search"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
};

export default SearchBar;
