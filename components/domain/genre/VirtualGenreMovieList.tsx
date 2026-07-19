"use client";

import { useState, useRef, useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import MovieCard from "@/components/domain/movie/MovieCard";
import { Movie } from "@/type/movie";
import { getMoviesByGenre } from "@/services/tmdb";

interface Props {
  genreId: string;
  initialMovies: Movie[];
}

export default function VirtualGenreMovieList({
  genreId,
  initialMovies,
}: Props) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const isFetchingRef = useRef(false);
  
  // 💡 더 이상 특정 박스 ref가 필요 없으므로 parentRef는 제거하거나 창 기준 타겟으로 사용 안 함
  const [columns, setColumns] = useState(5);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(5);
      else if (window.innerWidth >= 768) setColumns(3);
      else setColumns(2);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const rowCount = Math.ceil(movies.length / columns);

  // 💡 핵심 변경: getScrollElement를 window(브라우저 창)로 변경
  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    getScrollElement: () => (typeof window !== "undefined" ? window : null),
    estimateSize: () => 400,
    overscan: 3, // 자연스러운 스크롤을 위해 버퍼를 살짝 늘림
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (virtualItems.length === 0 || isFetchingRef.current || !hasMore) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    
    // 페이지 전체 스크롤이므로 여유 있게 마지막 3번째 행 쯤 도달하면 미리 fetch
    if (lastItem.index >= rowCount - 3) {
      const fetchNextPage = async () => {
        isFetchingRef.current = true;
        setIsLoading(true);

        try {
          const nextPage = page + 1;
          const newMovies = await getMoviesByGenre(genreId, nextPage);

          if (newMovies.length === 0) {
            setHasMore(false);
          } else {
            setMovies((prev) => [...prev, ...newMovies]);
            setPage(nextPage);
          }
        } catch (error) {
          console.error("영화를 불러오는 중 에러 발생:", error);
        } finally {
          isFetchingRef.current = false;
          setIsLoading(false);
        }
      };

      fetchNextPage();
    }
  }, [virtualItems, rowCount, hasMore, page, genreId]);

  return (
    <div className="mt-4 w-full">
      <p className="mb-6 text-sm font-normal text-muted-foreground">
        현재 {movies.length}개의 결과를 불러왔습니다.
      </p>

      {/* 💡 h-[80vh]와 overflow-y-auto를 삭제하여 상자를 없앴습니다. */}
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualRow) => {
          const startIdx = virtualRow.index * columns;
          const rowMovies = movies.slice(startIdx, startIdx + columns);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className="absolute top-0 left-0 w-full grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: "24px",
              }}
            >
              {rowMovies.map((movie, colIdx) => {
                const globalIndex = virtualRow.index * columns + colIdx;
                return (
                  <MovieCard
                    key={`${movie.id}-${virtualRow.index}-${colIdx}`}
                    id={movie.id}
                    title={movie.title}
                    poster_path={movie.poster_path}
                    release_date={movie.release_date}
                    priority={globalIndex < 5}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <p className="text-sm text-muted-foreground">영화를 불러오는 중...</p>
        </div>
      )}
    </div>
  );
}