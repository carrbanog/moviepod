"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  session: Session | null;
}

export default function AuthButton({ session }: AuthButtonProps) {
  console.log("AuthButton 렌더링, 세션 상태:", session);
  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{session.user?.name}님</span>
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
