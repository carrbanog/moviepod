"use client";

import MovieCard from "@/components/domain/movie/MovieCard";
import { Movie } from "@/type/movie";
import { getMoviesByGenre } from "@/services/tmdb";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface GenreMovieListProps {
  genreId: string;
  initialMovies: Movie[];
}

export default function GenreMovieList({
  genreId,
  initialMovies,
}: GenreMovieListProps) {
  const {
    data: movies,
    hasMore,
    isLoading,
    targetRef,
  } = useInfiniteScroll({
    initialData: initialMovies,
    fetchMore: (nextPage) => getMoviesByGenre(genreId, nextPage),
  });

  return (
    <div className="mt-4">
      <p className="mb-6 text-sm font-normal text-muted-foreground">
        현재 {movies.length}개의 결과를 불러왔습니다.
      </p>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie, index) => (
          <li key={`${movie.id}-${index}`}>
            <MovieCard
              id={movie.id}
              title={movie.title}
              poster_path={movie.poster_path}
              priority={index < 5}
              release_date={movie.release_date}
            />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div ref={targetRef} className="flex justify-center py-10 mt-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              영화를 불러오는 중...
            </p>
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}
    </div>
  );
}
