import { getPopularMovies } from "@/services/tmdb";
import MovieCard from "./MovieCard";

export default async function PopularMovieList() {
  const data = await getPopularMovies();
  const movies = data.results.slice(0, 10); // 상위 10개 영화만 사용

  console.log("Fetched popular movies:", movies); // 데이터가 제대로 로드되는지 확인하는 로그
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
