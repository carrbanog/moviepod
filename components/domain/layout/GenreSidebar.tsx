"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";


const MOVIE_GENRES = [
  { id: 28, name: "액션" },
  { id: 12, name: "모험" },
  { id: 16, name: "애니메이션" },
  { id: 35, name: "코미디" },
  { id: 80, name: "범죄" },
  { id: 99, name: "다큐멘터리" },
  { id: 18, name: "드라마" },
  { id: 10751, name: "가족" },
  { id: 14, name: "판타지" },
  { id: 36, name: "역사" },
  { id: 27, name: "공포" },
  { id: 10402, name: "음악" },
  { id: 9648, name: "미스터리" },
  { id: 10749, name: "로맨스" },
  { id: 878, name: "SF" },
  { id: 53, name: "스릴러" },
  { id: 10752, name: "전쟁" },
];

export default function GenreDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            {MOVIE_GENRES.map((genre) => (
              <li key={genre.id}>
                <Link
                  href={`/genre/${genre.id}?name=${genre.name}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-medium hover:bg-muted hover:text-primary transition-colors text-center"
                >
                  {genre.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
