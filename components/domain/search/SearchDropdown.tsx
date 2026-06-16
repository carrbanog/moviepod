import { Movie } from "@/type/movie";
import Image from "next/image";
import Link from "next/link";

interface SearchDropdownProps {
  isOpen: boolean;
  results: Movie[];
  isLoading: boolean;
  onClose: () => void;
}

export default function SearchDropdown({
  isOpen,
  results,
  isLoading,
  onClose,
}: SearchDropdownProps) {
  if (!isOpen) return null;

  console.log("검색어 자동완성", results);
  return (
    <div className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-xl border bg-background shadow-lg p-2">
      {results.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {results.map((movie) => (
            <li key={movie.id}>
              <Link
                href={`/movie/${movie.id}`}
                // 💡 중요: onMouseDown을 써야 input 포커스가 사라지기 전에 페이지 이동이 먼저 실행됩니다.
                onMouseDown={(e) => e.preventDefault()}
                onClick={onClose}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors"
              >
                {/* 썸네일 영역 */}
                <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded bg-secondary">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                      No Img
                    </div>
                  )}
                </div>
                {/* 텍스트 영역 */}
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium">
                    {movie.title}
                  </span>
                  <time className="text-xs text-muted-foreground">
                    {movie.release_date
                      ? movie.release_date.substring(0, 4)
                      : "미정"}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground">
          <p>일치하는 영화가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
