import Link from "next/link";
import { getServerSession } from "next-auth/next";
import AuthButton from "../auth/AuthButton";
import SearchBar from "@/components/domain/search/SearchBar";
import { Suspense } from "react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GenreSidebar from "@/components/domain/layout/GenreSidebar";

export default async function Header() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("세션을 가져오는 중 오류 발생:", error);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* 💡 핵심 변경: flex-wrap과 md:flex-nowrap을 사용해 모바일/PC 레이아웃 분리 */}
      <nav className="container mx-auto flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-3 md:h-16 md:py-0">
        
        {/* 1. 로고 (모바일/PC 모두 좌측 상단) */}
        {/* 모바일에서는 글자 크기를 살짝(2xl) 줄입니다. */}
        <Link
          href="/"
          className="order-1 text-2xl md:text-3xl tracking-widest text-[#E50914] transition-transform hover:scale-105"
          style={{ fontFamily: "var(--font-logo)" }}
        >
          MOVIEPOD
        </Link>

        {/* 2. 우측 버튼 그룹 (모바일/PC 모두 우측 상단) */}
        {/* 모바일에서는 버튼 간격(space-x-2)을 좁혀 공간을 확보합니다. */}
        <div className="order-2 md:order-3 flex items-center space-x-2 md:space-x-4">
          <Suspense fallback={<div className="h-9 w-20 md:w-24 bg-muted rounded-md animate-pulse"></div>}>
            <AuthButton session={session} />
          </Suspense>
          <GenreSidebar />
        </div>

        {/* 3. 검색창 (모바일에서는 2번째 줄 전체 차지, PC에서는 가운데 배치) */}
        {/* w-full과 mt-3을 주어 모바일에서 아래줄로 꽉 차게 내립니다. */}
        <div className="order-3 md:order-2 mt-3 md:mt-0 flex w-full justify-center md:w-auto md:flex-1 md:px-8">
          <SearchBar />
        </div>

      </nav>
    </header>
  );
}