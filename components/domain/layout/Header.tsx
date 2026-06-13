import Link from "next/link";
import { getServerSession } from "next-auth/next";
import AuthButton from '../auth/AuthButton';
import SearchBar from "@/components/domain/search/SearchBar";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// 💡 방금 새로 만든 드롭다운 컴포넌트를 불러옵니다.
import GenreSidebar from '@/components/domain/layout/GenreSidebar'; 

export default async function Header() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("세션을 가져오는 중 오류 발생:", error);
  }

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

        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        {/* 네비게이션 및 인터랙션 요소 */}
        <div className="flex items-center space-x-4">
          <AuthButton session={session} />
          
          <GenreSidebar />
        </div>
      </div>
    </header>
  );
}