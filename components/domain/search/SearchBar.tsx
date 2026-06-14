"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Movie } from "@/type/movie";
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

    // 1. AbortController 인스턴스 생성
    const controller = new AbortController();

    const fetchLiveSearch = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debounceQuery)}`,
          { signal: controller.signal }, // 2. fetch 옵션에 signal 연결
        );

        if (res.ok) {
          const data = await res.json();
          setResults(data.results?.slice(0, 5) || []);
          setIsLoading(false);
          setIsOpen(true);
        }
      } catch (error) {
        // 1. error가 자바스크립트의 기본 Error 객체인지 확인 (타입 가드)
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.log("이전 검색 요청이 취소되었습니다.");
          } else {
            // Error 객체가 맞으므로 .message나 .name을 안전하게 사용할 수 있습니다.
            console.error("검색 중 에러 발생:", error.message);
          }
        } else {
          // 2. Error 객체가 아닌 다른 무언가가 throw 되었을 때의 방어 로직
          console.error("알 수 없는 에러 발생:", error);
        }
      }
    };
    fetchLiveSearch();

    // 3. Cleanup 함수:
    // debounceQuery가 바뀌어 useEffect가 다시 실행되기 직전이나,
    // 컴포넌트가 화면에서 사라질 때(Unmount) 이전 fetch 요청을 강제 취소!
    return () => {
      controller.abort();
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
        onSubmit={handleSearchSubmit}
        className="relative flex w-full max-w-2xl items-center"
      >
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
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
