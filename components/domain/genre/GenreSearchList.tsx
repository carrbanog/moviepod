import MovieCard from "@/components/domain/movie/MovieCard";
import { Movie } from "@/type/movie";
import { getMoviesByGenre } from "@/services/tmdb";
import ErrorFallback from "@/components/domain/layout/ErrorFallback";

export default async function GenreMovieList({ genreId }: { genreId: string }) {
  const movies = await getMoviesByGenre(genreId);

  if (movies.length === 0) {
    return (
      <div className="py-20 mt-8 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/20">
        해당 장르의 영화를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-6 text-muted-foreground text-sm font-normal">
        총 {movies.length}개의 결과를 찾았습니다.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {/* 💡 방금 전에 배운 LCP 최적화(priority)까지 함께 적용했습니다! */}
        {movies.map((movie: Movie, index: number) => (
          <MovieCard
            key={`${movie.id}-${index}`} // 가끔 TMDB API가 중복된 영화를 줄 수 있어 index를 섞어 key 충돌을 방지합니다.
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
            priority={index < 10}
            release_date={movie.release_date}
          />
        ))}
      </div>
    </div>
  );
}
