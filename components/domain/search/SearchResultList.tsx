import MovieCard from "@/components/domain/movie/MovieCard";
import ErrorFallback from "@/components/domain/layout/ErrorFallback";
import { searchMovies } from "@/services/tmdb";
import { Movie } from "@/type/movie";

export default async function SearchResultList({ query }: { query: string }) {
  const movies = await searchMovies(query);

  if (movies.length === 0) {
    return (
      <div className="py-20 mt-8 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/20">
        검색 결과가 없습니다. 다른 검색어로 시도해보세요.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-6 text-muted-foreground text-sm font-normal">
        총 {movies.length}개의 결과를 찾았습니다.
      </p>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie: Movie, index: number) => (
          <li key={movie.id}>
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
    </div>
  );
}
