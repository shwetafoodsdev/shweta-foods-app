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
    // On mobile the category select is hidden; avoid carrying stale category filters.
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const effectiveCategory = isMobile ? "all" : category;
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (effectiveCategory !== "all") next.set("category", effectiveCategory);
    router.push(`/products${next.toString() ? `?${next.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex h-10 w-full min-w-0 max-w-full flex-1 items-center gap-0 overflow-hidden rounded-full border border-border/70 bg-card/90 shadow-sm transition-all duration-300 focus-within:border-primary/60 focus-within:shadow-[0_0_0_4px_rgba(230,126,34,0.12)] sm:h-11 md:max-w-none"
    >
      <select
        className="hidden h-10 shrink-0 border-r border-border/70 bg-transparent px-3 text-xs text-foreground outline-none sm:block sm:h-11 sm:px-4 sm:text-sm"
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
        className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground sm:h-11 sm:px-4"
        placeholder="Search for khakhra, namkeen, samosa..."
      />
      <button
        type="submit"
        className="m-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-secondary sm:m-1 sm:h-9 sm:w-9"
        aria-label="Search"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
};

export default SearchBar;
