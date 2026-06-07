import { getPopularMovies } from "@/services/tmdb";
import MovieCard from "./MovieCard";

export default async function PopularMovieList() {
  const data = await getPopularMovies();
  const movies = data.results.slice(0, 10); // 상위 10개 영화만 사용

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
