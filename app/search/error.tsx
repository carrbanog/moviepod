'use client'; // 💡 에러 컴포넌트는 반드시 클라이언트 컴포넌트여야 합니다.

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // 💡 에러 바운더리를 재설정하고 렌더링을 다시 시도하는 함수
}) {
  useEffect(() => {
    // 실제 서비스에서는 여기에 Sentry 같은 에러 추적 시스템 로그를 보냅니다.
    console.error("페이지 에러 발생:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <AlertCircle className="h-16 w-16 text-destructive" />
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          앗! 데이터를 불러오는데 실패했습니다
        </h2>
        <p className="text-muted-foreground">
          일시적인 네트워크 오류이거나 영화 데이터를 찾을 수 없습니다.
        </p>
      </div>

      {/* onClick에 reset 함수를 연결하여 데이터 페칭을 재시도합니다. */}
      <Button onClick={() => reset()} variant="outline" className="min-w-[120px]">
        다시 시도하기
      </Button>
    </div>
  );
}