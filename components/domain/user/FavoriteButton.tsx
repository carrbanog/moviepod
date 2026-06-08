'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoriteMovieResponse, MovieDetailResponse } from '@/type/movie';

interface FavoriteButtonProps {
  movie: MovieDetailResponse; // 💡 부모(상세 페이지)에서 영화 전체 데이터를 받아옵니다.
}

export default function FavoriteButton({ movie }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // 1. 유저의 전체 찜 목록 가져오기
  const { data: favorites = [] } = useQuery<FavoriteMovieResponse[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();
      return data.favorites;
    },
    enabled: !!session?.user, // 로그인 상태일 때만 실행
  });

  const movieIdStr = String(movie.id);
  const isFavorite = favorites.some((fav) => fav.movieId === movieIdStr);

  // 3. 찜하기 토글 (낙관적 업데이트 적용)
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 💡 DB 저장을 위해 영화 객체 통째로 API에 전송합니다.
        body: JSON.stringify({ movie }), 
      });
      if (!res.ok) throw new Error("Failed to toggle favorite");
      return res.json();
    },
    // [성능 최적화] 서버 응답을 기다리지 않고 화면의 하트를 즉시 변경합니다.
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      
      // 기존 캐시 백업
      const previousFavorites = queryClient.getQueryData<FavoriteMovieResponse[]>(["favorites"]);

      // UI 강제 업데이트
      queryClient.setQueryData<FavoriteMovieResponse[]>(["favorites"], (old = []) => {
        if (old.some((fav) => fav.movieId === movieIdStr)) {
          // 이미 찜한 상태면 목록에서 제거
          return old.filter((fav) => fav.movieId !== movieIdStr);
        } else {
          // 안 한 상태면 목록에 임시 추가 (화면 표시용)
          const newFav = {
            movieId: movieIdStr,
            title: movie.title,
            poster_path: movie.poster_path,
            genres: movie.genres,
          } as FavoriteMovieResponse;
          return [...old, newFav];
        }
      });

      return { previousFavorites };
    },
    // 에러 발생 시 백업해둔 이전 상태로 롤백
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
    },
    // 최종적으로 서버 데이터와 다시 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // 로그인하지 않은 경우의 UI
  if (!session) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Heart className="h-4 w-4" /> 로그인 후 찜하기
      </Button>
    );
  }

  // 로그인한 경우의 UI
  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      className={`gap-2 transition-colors ${
        isFavorite ? "bg-red-500 text-white hover:bg-red-600 border-red-500" : ""
      }`}
      disabled={toggleFavoriteMutation.isPending}
      onClick={() => toggleFavoriteMutation.mutate()}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current text-white" : ""}`} />
      {isFavorite ? "찜 완료" : "내 보관함에 저장"}
    </Button>
  );
}