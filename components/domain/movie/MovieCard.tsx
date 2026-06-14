import Image from "next/image";
import { Movie } from "@/type/movie";
import  Link from "next/link"; 
interface MovieCardProps {
  id: string | number;
  title: string;
  poster_path: string;
  priority?: boolean;
  release_date: string;
}

export default function MovieCard({ id, title, poster_path, priority, release_date }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${id}`}
      className="group flex flex-col gap-2 rounded-lg border p-3 shadow-sm transition-transform hover:scale-105"
    >
      {/* w/342를 적용해서 네트워크 탭에서 682kb로 줄임 */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted">
        <Image
          src={`https://image.tmdb.org/t/p/w342${poster_path}`}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-opacity group-hover:opacity-80"
          priority={priority}
        />
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="line-clamp-1 text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{release_date}</p>
      </div>
    </Link>
  );
}
