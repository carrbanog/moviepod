"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { liveSearchAction } from "@/actions/search";
import SearchDropdown from "@/components/domain/search/SearchDropdown";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["liveSearch", debounceQuery],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debounceQuery)}`, { signal });
      const data = await res.json();
      return data?.slice(0, 5) || [];
    },
    enabled: debounceQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (debounceQuery.trim() && (results.length > 0 || isFetching)) {
      setIsOpen(true);
    } else if (!debounceQuery.trim()) {
      setIsOpen(false);
    }
  }, [results, isFetching, debounceQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/find?q=${encodeURIComponent(query)}`);
    }
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div
      className="relative max-w-2xl flex items-center w-full "
      ref={dropdownRef}
    >
      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="relative flex w-full max-w-2xl items-center"
      >
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          aria-label="영화 검색"
          placeholder="보고싶은 영화를 검색해보세요"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          onFocus={() => debounceQuery.trim() && setIsOpen(true)}
          className="h-10 w-full rounded-full border bg-secondary/50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-background"
        />
      </form>

      <SearchDropdown
        isOpen={isOpen}
        results={results}
        isLoading={isFetching}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}