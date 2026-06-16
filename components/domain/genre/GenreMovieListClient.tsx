"use client";

import { useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import MovieCard from "@/components/domain/movie/MovieCard";
import { Movie } from "@/type/movie";
import { getMoviesByGenre } from "@/services/tmdb";

interface Props {
  genreId: string;
  initialMovies: Movie[];
}

export default function GenreMovieListClient({
  genreId,
  initialMovies,
}: Props) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const isFetchingRef = useRef(false);

  const { ref } = useInView({
    threshold: 0,
    onChange: async (inView) => {
      if (!inView || isFetchingRef.current || !hasMore) return;

      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const nextPage = page + 1;
        const newMovies = await getMoviesByGenre(genreId, nextPage);

        if (newMovies.length === 0) {
          setHasMore(false);
        } else {
          setMovies((prev) => [...prev, ...newMovies]);
          setPage(nextPage);
        }
      } catch (error) {
        console.error("영화를 불러오는 중 에러 발생:", error);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
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
              priority={index < 10}
              release_date={movie.release_date}
            />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div ref={ref} className="flex justify-center py-10 mt-4">
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
