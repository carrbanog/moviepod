"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import MovieCard from "@/components/domain/movie/MovieCard";
import { Movie } from "@/type/movie";

export default function VirtualGenreMovieList({ movies }: { movies: Movie[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  // 💡 가로 5열 그리드 기준 (화면 크기에 따라 유연하게 늘어나도록 행 개수 계산)
  const COLUMNS = 5;
  const rowCount = Math.ceil(movies.length / COLUMNS);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 380, // 영화 카드 세로 높이 + 마진 간격 예상치
    overscan: 2, // 화면 바깥에 버퍼로 미리 그려둘 행의 개수
  });

  return (
    // 💡 윈도우 스크롤 대신 이 영역 자체에 h-[80vh] 고정 높이를 주어 무한 스크롤 느낌을 냅니다.
    <div
      ref={parentRef}
      className="h-[80vh] w-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
    >
      {/* 1000개가 다 늘어났을 때의 가상 전체 높이 박스 */}
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {/* 현재 모니터 화면에 노출되는 가상 행(Row)들만 돌면서 렌더링 */}
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIdx = virtualRow.index * COLUMNS;
          const rowMovies = movies.slice(startIdx, startIdx + COLUMNS);

          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`, // Y축 절대 위치 고정
              }}
            >
              {rowMovies.map((movie, colIdx) => (
                <MovieCard
                  key={`${movie.id}-${virtualRow.index}-${colIdx}`}
                  id={movie.id}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  release_date={movie.release_date}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}