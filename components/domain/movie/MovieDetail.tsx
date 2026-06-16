// components/domain/movie/MovieDetailContainer.tsx
import Image from "next/image";
import { getMovieDetail, getMovieTrailer } from "@/services/tmdb";
import FavoriteButton from "@/components/domain/user/FavoriteButton";
import MovieTrailer from "./MovieTrailer";

interface MovieDetailContainerProps {
  id: string;
}

export default async function MovieDetailContainer({
  id,
}: MovieDetailContainerProps) {
  const [movie, trailerKey] = await Promise.all([
    getMovieDetail(id),
    getMovieTrailer(id),
  ]);

  return (
    <article className="flex flex-col gap-12 w-full">
      <div className="flex flex-col gap-8 md:flex-row">
        <figure className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg md:w-[300px]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
            priority
          />
        </figure>

        {/* 영화 상세 정보 텍스트 영역 */}
        <div className="flex flex-col justify-center space-y-4 flex-1">
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          <div>
            <FavoriteButton movie={movie} />
          </div>

          {movie.tagline && (
            <p className="text-lg italic text-muted-foreground">
              "{movie.tagline}"
            </p>
          )}

          <ul className="flex gap-2 flex-wrap" aria-label="영화 장르">
            {movie.genres.map((genre) => (
              <li
                key={genre.id}
                className="rounded-full bg-secondary px-3 py-1 text-sm"
              >
                {genre.name}
              </li>
            ))}
          </ul>

          <p className="text-lg leading-relaxed">{movie.overview}</p>

          <div className="text-sm text-muted-foreground">
            <p>
              개봉일: <time>{movie.release_date}</time>
            </p>
            <p>상영 시간: {movie.runtime}분</p>
            <p>평점: ⭐️ {movie.vote_average.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <section className="border-t pt-8 w-full">
        <h2 className="text-2xl font-bold mb-4">🎬 메인 예고편</h2>

        {trailerKey ? (
          <MovieTrailer trailerKey={trailerKey} movieTitle={movie.title} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              📺 등록된 메인 예고편이 없습니다.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              다른 언어나 관련 영상 리소스가 존재하지 않는 영화입니다.
            </p>
          </div>
        )}
      </section>
    </article>
  );
}
