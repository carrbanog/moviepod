// components/domain/MovieCardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3 shadow-sm">
      {/* 이미지 영역: aspect-[2/3] 비율을 그대로 유지합니다. */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* 텍스트 영역 */}
      <div className="mt-2 space-y-2">
        {/* 영화 제목 스켈레톤 */}
        <Skeleton className="h-4 w-5/6" />
        {/* 개봉일 스켈레톤 */}
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}