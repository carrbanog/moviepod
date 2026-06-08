// components/domain/PopularMovieListSkeleton.tsx
import MovieCardSkeleton from "./MovieCardSkeleton";

interface PopularMovieListSkeletonProps {
  count?: number;
}

export default function PopularMovieListSkeleton({ count = 10 }: PopularMovieListSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}