"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react"; // 🚀 useSession 추가
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const router = useRouter();

  useEffect(() => {
    if (authError) {
      if (authError === "login_required") {
        toast.error("로그인이 필요한 페이지입니다.");
      } else {
        toast.error("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      router.replace("/");
    }
  }, [authError, router]);

  if (status === "loading") {
    return <div className="h-9 w-20 md:w-24 bg-muted rounded-md animate-pulse" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
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

  return (
    <button
      onClick={() => signIn("google")}
      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      구글 로그인
    </button>
  );
}