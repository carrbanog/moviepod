import Image from "next/image";
import { Movie } from "@/type/movie";
import  Link from "next/link"; 
interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group flex flex-col gap-2 rounded-lg border p-3 shadow-sm transition-transform hover:scale-105"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-opacity group-hover:opacity-80" // 마우스 오버 시 살짝 투명해지는 효과 추가
        />
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="line-clamp-1 text-sm font-semibold">{movie.title}</h3>
        <p className="text-xs text-muted-foreground">{movie.release_date}</p>
      </div>
    </Link>
  );
}
