import { getMoviesByGenre } from "@/services/tmdb";
import GenreMovieListClient from "@/components/domain/genre/GenreMovieListClient";

export default async function GenreMovieContainer({ genreId }: { genreId: string }) {
  // 첫 데이터를 서버에서 가져와서 초기렌더링 향상
  const movies = await getMoviesByGenre(genreId, 1);

  if (movies.length === 0) {
    return (
      <div className="py-20 mt-8 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/20">
        해당 장르의 영화를 찾을 수 없습니다.
      </div>
    );
  }

  return <GenreMovieListClient genreId={genreId} initialMovies={movies} />;
}
