import { Skeleton } from "@/components/ui/skeleton";
import MovieCardSkeleton from "@/components/domain/movie/MovieCardSkeleton";

export default function MovieListSkeleton() {
  return (
    <div className="mt-4">
      <Skeleton className="h-5 w-48 mb-6" />
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}