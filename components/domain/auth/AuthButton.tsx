"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";

interface AuthButtonProps {
  session: Session | null;
}

export default function AuthButton({ session }: AuthButtonProps) {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const router = useRouter();

  console.log("AuthButton 렌더링, session:", session);
  console.log("AuthButton 렌더링, authError:", authError);

  useEffect(() => {
    if (authError) {
      if (authError === "login_required") {
        toast.error("로그인이 필요한 페이지입니다.");
      } else {
        toast.error("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      router.replace("/"); // 2단계 공통 처리
    }
  }, [authError, router]);

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {/* 선택 사항: 유저 아바타 이미지가 없다면 lucide 아이콘 배치 */}
          <User className="h-4 w-4" />
          <span>{session.user?.name}님</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          로그아웃
        </button>
      </div>
    );
  }

  // 비로그인 상태일 때 (구글 로그인 버튼 렌더링)
  return (
    <button
      onClick={() => signIn("google")}
      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      구글 로그인
    </button>
  );
}
