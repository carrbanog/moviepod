import { Skeleton } from "@/components/ui/skeleton";
import MovieCardSkeleton from "@/components/domain/movie/MovieCardSkeleton";

interface MovieListSkeletonProps {
  count?: number;
  showTitle?: boolean; // 제목 스켈레톤을 보여줄지 말지 결정
}

export default function MovieListSkeleton({
  count = 10,
  showTitle = false,
}: MovieListSkeletonProps) {
  return (
    <div className={showTitle ? "mt-4" : ""}>
      {showTitle && <Skeleton className="h-5 w-48 mb-6" />}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: count }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
