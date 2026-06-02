"use client";

import Link from "next/link";

export default function Header() {
  // 추후 NextAuth 세션 상태에 따라 로그인/로그아웃 버튼을 스위칭할 예정입니다.
  const handleLogin = () => {
    console.log("로그인 프로세스 시작");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 서비스 이름 및 로고 링크 */}
        <Link
          href="/"
          className="text-3xl tracking-widest text-[#E50914] transition-transform hover:scale-105"
          style={{ fontFamily: "var(--font-logo)" }}
        >
          MOVIEPOD
        </Link>
        {/* 네비게이션 및 인터랙션 요소 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogin}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
