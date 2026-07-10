import Link from "next/link";
import AuthButton from "../auth/AuthButton";
import SearchBar from "@/components/domain/search/SearchBar";
import { Suspense } from "react";

import GenreSidebar from "@/components/domain/layout/GenreSidebar";

export default function Header() {
  // 🚀 서버 세션 조회 로직을 걷어내어 헤더를 정적으로 유지합니다.
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-3 md:h-16 md:py-0">
        
        <Link
          href="/"
          className="order-1 text-2xl md:text-3xl tracking-widest text-[#E50914] transition-transform hover:scale-105"
          style={{ fontFamily: "var(--font-logo)" }}
        >
          MOVIEPOD
        </Link>

        <div className="order-2 md:order-3 flex items-center space-x-2 md:space-x-4">
          <Suspense fallback={<div className="h-9 w-20 md:w-24 bg-muted rounded-md animate-pulse"></div>}>
            {/* session props를 넘기지 않습니다. */}
            <AuthButton /> 
          </Suspense>
          <GenreSidebar />
        </div>

        <div className="order-3 md:order-2 mt-3 md:mt-0 flex w-full justify-center md:w-auto md:flex-1 md:px-8">
          <SearchBar />
        </div>

      </nav>
    </header>
  );
}