import MovieTrailer from "@/components/domain/movie/MovieTrailer";
import { getMovieTrailer } from "@/services/tmdb";


export default async function TrailerSection({ id, movieTitle }: { id: string; movieTitle: string }) {
  const trailerKey = await getMovieTrailer(id);

  if (!trailerKey) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">📺 등록된 메인 예고편이 없습니다.</p>
      </div>
    );
  }

  return <MovieTrailer trailerKey={trailerKey} movieTitle={movieTitle} />;
}