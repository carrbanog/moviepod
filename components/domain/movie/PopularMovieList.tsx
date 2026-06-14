import { getPopularMovies } from "@/services/tmdb";
import MovieCard from "./MovieCard";
import { Movie } from "@/type/movie";
import ErrorFallback from "@/components/domain/layout/ErrorFallback";



export default async function PopularMovieList() {
  try {
    const data = await getPopularMovies();
    const movies = data.results.slice(0, 10); 

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie: Movie, index: number) => (
          <MovieCard key={movie.id} 
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
            priority={index < 5}
            release_date={movie.release_date}
          />
        ))}
      </div>
    );
  } catch (error) {
    console.error("인기 영화 로딩 실패:", error);
    return <ErrorFallback message="인기 영화 목록을 불러오는 중 문제가 발생했습니다." />
  }
}