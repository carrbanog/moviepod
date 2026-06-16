"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import MovieCardSkeleton from "@/components/domain/movie/MovieCardSkeleton";
import { FavoriteMovieResponse } from "@/type/movie";
import MovieCard from "@/components/domain/movie/MovieCard";
import ErrorFallback from "@/components/domain/layout/ErrorFallback";
import { getFavoriteMovies } from '@/services/client-api';

export default function FavoriteMoviesList() {
  const { data: session } = useSession();

  const {
    data: favorites = [],
    isLoading,
    isError,
    error,
  } = useQuery<FavoriteMovieResponse[], Error>({
    queryKey: ["favorites"],
    queryFn: () => getFavoriteMovies(),
    enabled: !!session?.user,
    retry: false, // 에러 테스트 시 딜레이를 없애기 위해 추가 (선택사항)
  });

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="h-8 w-48 bg-muted rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorFallback message={error.message} />;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">내가 찜한 영화</h2>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">아직 찜한 영화가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.movieId}
              id={movie.movieId}
              title={movie.title}
              poster_path={movie.poster_path}
              release_date={movie.release_date}
            />
          ))}
        </div>
      )}
    </div>
  );
}
