import Link from "next/link";
import { getServerSession } from "next-auth/next";
import AuthButton from '../domain/AuthButton';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
        {/* 네비게이션 및 인터랙션 요소 */}
        <div className="flex items-center space-x-4">
          <AuthButton session={session} />
        </div>
      </div>
    </header>
  );
}
