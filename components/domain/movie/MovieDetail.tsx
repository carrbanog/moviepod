// components/domain/movie/MovieDetailContainer.tsx
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMovieDetail } from "@/services/tmdb";
import FavoriteButton from "@/components/domain/user/FavoriteButton";
import TrailerSection from "@/components/domain/movie/TrailerSection";


interface MovieDetailContainerProps {
  id: string;
}

export default async function MovieDetailContainer({
  id,
}: MovieDetailContainerProps) {
  // const [movie, trailerKey] = await Promise.all([
  //   getMovieDetail(id),
  //   getMovieTrailer(id),
  // ]);
  const movie = await getMovieDetail(id);
  console.log("영화 상세 정보", movie);
  return (
    <article className="flex flex-col gap-12 w-full">
      <div className="flex flex-col gap-8 md:flex-row">
        <figure className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg md:w-[300px]">
          <Image
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
            priority
            fetchPriority='high'
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
                <Link href={`/genre/${genre.id}?name=${genre.name}`}>
                  {genre.name}
                </Link>
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

      <section>
        <h2 className="text-2xl font-bold mb-4">🎬 메인 예고편</h2>
        <Suspense fallback={<div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />}>
          <TrailerSection id={id} movieTitle={movie.title} />
        </Suspense>
      </section>
    </article>
  );
}
