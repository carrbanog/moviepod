"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MOVIE_GENRES } from "@/constants/genre";

export default function GenreDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const currentGenreId = params?.id ? Number(params.id) : null;
  console.log("params", params);

  // 메뉴 바깥을 클릭하면 자동으로 닫히는 방어 로직
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        aria-label="장르 메뉴 열기"
      >
        <span>장르</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-xl shadow-lg z-50 overflow-hidden">
          <ul className="max-h-[60vh] overflow-y-auto py-2 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {MOVIE_GENRES.map((genre) => {
              const isActive = currentGenreId === genre.id;

              return (
                <li key={genre.id}>
                  <Link
                    href={`/genre/${genre.id}?name=${genre.name}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-sm transition-colors text-center
                      ${
                        isActive
                          ? "bg-muted text-primary font-bold" // 🔥 선택되었을 때 표시할 스타일
                          : "font-medium text-muted-foreground hover:bg-muted hover:text-primary"
                      }`}
                  >
                    {genre.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
