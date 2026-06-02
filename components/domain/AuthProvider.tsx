'use client'; // 👈 Context를 쓰기 위해 반드시 필요합니다.

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    // SessionProvider가 하위 컴포넌트(children)들에게 로그인 상태를 공급해 줍니다.
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}