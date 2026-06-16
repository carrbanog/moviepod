import { getMoviesByGenre } from "@/services/tmdb";
import MovieCard from "../movie/MovieCard";
import { Movie } from "@/type/movie";
import ErrorFallback from "@/components/domain/layout/ErrorFallback";

interface FavoriteGenreMovieListProps {
  genreId: number;
}

export default async function FavoriteGenreMovieList({
  genreId,
}: FavoriteGenreMovieListProps) {
  let movies: Movie[] = [];

  try {
    const data = await getMoviesByGenre(String(genreId), 1);
    console.log("좋아하는 장르 영화", data);
    movies = data.slice(0, 5);
  } catch (error) {
    console.error("좋아하는 장르 영화 로딩 실패:", error);
    return (
      <ErrorFallback message="추천 영화 목록을 불러오는 중 문제가 발생했습니다." />
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        해당 장르의 추천 영화가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie: Movie, index: number) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          poster_path={movie.poster_path}
          priority={index < 5}
          release_date={movie.release_date}
        />
      ))}
    </div>
  );
}
