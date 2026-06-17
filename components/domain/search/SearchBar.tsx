"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Movie } from "@/type/movie";
import { liveSearchAction } from "@/actions/search";
import SearchDropdown from "@/components/domain/search/SearchDropdown";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState(""); //검색어 자동완성 쿼리
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debounceQuery.trim()) {
      setIsOpen(false);
      setResults([]);
      return;
    }

    let ignore = false;
    const fetchLiveSearch = async () => {
      try {
        setIsLoading(true);
        const data = await liveSearchAction(debounceQuery);

        if (!ignore) {
          setResults(data?.slice(0, 5) || []);
          setIsLoading(false);
          setIsOpen(true);
        }
      } catch (error) {
        if (!ignore) {
          console.log("검색 중 에러 발생:", error);
          setIsLoading(false);
        }
      }
    };
    fetchLiveSearch();

    return () => {
      ignore = true;
    };
  }, [debounceQuery]);

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
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    setQuery("");
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
          // 자동완성을 띄우기 위한 onFocus 이벤트도 비워두었습니다.
          className="h-10 w-full rounded-full border bg-secondary/50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-background"
        />
      </form>

      <SearchDropdown
        isOpen={isOpen}
        results={results}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
