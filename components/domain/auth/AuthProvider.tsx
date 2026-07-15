// components/domain/AuthProvider.tsx
"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// 1. Devtools 임포트 추가
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // [최적화 측정 포인트] useState를 사용해 SSR 환경에서 
  // QueryClient 인스턴스가 불필요하게 재생성되는 것을 방지합니다.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 신선(fresh)하게 유지
        refetchOnWindowFocus: false, // 브라우저 창 탭을 전환했다가 돌아올 때 자동 리페치 방지
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        
        {/* 2. Provider 내부에 Devtools 배치 (처음에는 닫혀있도록 설정) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}