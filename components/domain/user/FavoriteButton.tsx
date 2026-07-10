"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoriteMovieResponse, ToggleFavoritePayload } from "@/type/movie";
import { getFavoritesActions, toggleFavoriteAction } from "@/actions/favorite";

interface FavoriteButtonProps {
  movie: ToggleFavoritePayload;
}

export default function FavoriteButton({ movie }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // 1. 전역 찜 목록 데이터 조회
  const { data: favorites = [] } = useQuery<FavoriteMovieResponse[]>({
    queryKey: ["favorites"],
    queryFn: () => getFavoritesActions(),
    enabled: !!session?.user,
  });

  const movieIdStr = String(movie.id);
  
  const isFavorite = favorites.some((fav) => fav.movieId === movieIdStr);
  
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const payload: ToggleFavoritePayload = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        genres: movie.genres,
      };
      return await toggleFavoriteAction(payload);
    },
    
    // 💡 서버 요청 직전: 캐시를 미리 바꾸어 사용자에게 0ms 반응 속도를 제공합니다.
    onMutate: async () => {
      // 진행 중인 다른 찜하기 요청이 있다면 취소하여 동시성 문제를 방지합니다.
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      
      // 에러 발생 시 원래대로 되돌리기 위해 현재 캐시 데이터를 백업합니다.
      const previousFavorites = queryClient.getQueryData<FavoriteMovieResponse[]>(["favorites"]);

      // 캐시 데이터를 먼저 수정합니다 (하트 불빛 즉시 반전 효과)
      queryClient.setQueryData<FavoriteMovieResponse[]>(
        ["favorites"],
        (old = []) => {
          if (old.some((fav) => fav.movieId === movieIdStr)) {
            // 이미 있으면 제거 (찜 해제)
            return old.filter((fav) => fav.movieId !== movieIdStr);
          } else {
            // 없으면 임시 데이터 추가 (찜 등록)
            const newFav = { 
              movieId: movieIdStr, 
              title: movie.title, 
              poster_path: movie.poster_path 
            } as FavoriteMovieResponse;
            return [...old, newFav];
          }
        },
      );
      
      // 백업한 데이터를 context로 반환합니다.
      return { previousFavorites };
    },
    
    // 💡 서버 요청 실패 시: 백업해 둔 이전 캐시 데이터로 원상복구(롤백)합니다.
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
      toast.error(err.message || "요청에 실패했습니다. 다시 시도해주세요.");
    },
    
    // 💡 성공/실패 여부와 관계없이 완료 시: 서버 데이터와 완전히 동기화하기 위해 캐시를 무효화합니다.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // 로그인하지 않은 상태의 UI
  if (!session) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Heart className="h-4 w-4" /> 로그인 후 찜하기
      </Button>
    );
  }

  // 버튼 클릭 핸들러
  const handleToggle = () => {
    toggleFavoriteMutation.mutate();
  };

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      className={`gap-2 transition-colors ${
        isFavorite ? "bg-red-500 text-white hover:bg-red-600 border-red-500" : ""
      }`}
      onClick={handleToggle}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current text-white" : ""}`} />
      {isFavorite ? "찜 완료" : "내 보관함에 저장"}
    </Button>
  );
}