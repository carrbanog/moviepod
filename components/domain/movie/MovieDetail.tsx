// components/domain/movie/MovieDetailContainer.tsx
import Image from "next/image";
import { getMovieDetail } from "@/services/tmdb";
import FavoriteButton from "@/components/domain/user/FavoriteButton";

interface MovieDetailContainerProps {
  id: string;
}

export default async function MovieDetailContainer({ id }: MovieDetailContainerProps) {
  // 💡 id를 이용해 서버에서 영화 상세 데이터를 직접 가져옵니다.
  const movie = await getMovieDetail(id);

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      {/* 포스터 이미지 영역 */}
      <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg md:w-[300px]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
          priority // [최적화 측정 포인트] LCP 최적화
        />
      </div>

      {/* 영화 상세 정보 텍스트 영역 */}
      <div className="flex flex-col justify-center space-y-4">
        <h1 className="text-4xl font-bold">{movie.title}</h1>

        <div>
          <FavoriteButton movie={movie} />
        </div>
        
        {movie.tagline && (
          <p className="text-lg italic text-muted-foreground">"{movie.tagline}"</p>
        )}
        
        <div className="flex gap-2">
          {movie.genres.map((genre) => (
            <span key={genre.id} className="rounded-full bg-secondary px-3 py-1 text-sm">
              {genre.name}
            </span>
          ))}
        </div>
        
        <p className="text-lg leading-relaxed">{movie.overview}</p>
        
        <div className="text-sm text-muted-foreground">
          <p>개봉일: {movie.release_date}</p>
          <p>상영 시간: {movie.runtime}분</p>
          <p>평점: ⭐️ {movie.vote_average.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}