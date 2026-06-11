"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import MovieCardSkeleton from "@/components/domain/movie/MovieCardSkeleton";
import { FavoriteMovieResponse } from "@/type/movie";
import MovieCard from "@/components/domain/movie/MovieCard";

export default function FavoriteMoviesList() {
  const { data: session } = useSession();
  
  const { 
    data: favorites = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery<FavoriteMovieResponse[], Error>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites"); 
      
      // 💡 1. 상단에서 res.ok를 먼저 체크하여 HTML 파싱 시도를 원천 차단합니다.
      if (!res.ok) {
        try {
          // 서버가 정상적인 JSON 에러 메시지를 보냈다면 파싱해서 사용
          const errorData = await res.json();
          throw new Error(errorData.error || "데이터를 처리하는 중 오류가 발생했습니다.");
        } catch (jsonError) {
          // 💡 2. [UX 안전망] 주소가 틀리거나 서버가 터져서 HTML 에러 페이지를 뱉었을 때 처리
          if (res.status === 404) {
            throw new Error("요청하신 서비스를 찾을 수 없습니다. (404)");
          }
          throw new Error("서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
        }
      }
      
      return res.json();
    },
    enabled: !!session?.user,
    retry: false, // 에러 테스트 시 딜레이를 없애기 위해 추가 (선택사항)
  });

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="h-8 w-48 bg-muted rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-12 p-6 text-center text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
        <p className="font-semibold">영화를 불러오지 못했습니다.</p>
        {/* 💡 유저에게 정제된 한국어 에러 메시지가 노출됩니다. */}
        <p className="text-sm mt-2 text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">내가 찜한 영화</h2>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">아직 찜한 영화가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.movieId}
              id={movie.movieId}
              title={movie.title}
              poster_path={movie.poster_path}
            />
          ))}
        </div>
      )}
    </div>
  );
}