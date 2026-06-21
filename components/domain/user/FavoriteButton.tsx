"use client";

import { useState, useEffect } from "react"; // 💡 useState, useEffect 추가
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

  const { data: favorites = [] } = useQuery<FavoriteMovieResponse[]>({
    queryKey: ["favorites"],
    queryFn: () => getFavoritesActions(),
    enabled: !!session?.user,
  });

  const movieIdStr = String(movie.id);
  const isFavoriteFromCache = favorites.some((fav) => fav.movieId === movieIdStr);

  // 💡 [핵심] 0ms 즉시 반응을 위한 독립 로컬 상태 선언
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavoriteFromCache);

  // 💡 로그인 직후나 캐시가 완전히 동기화되었을 때 로컬 상태를 맞춰줍니다.
  useEffect(() => {
    setLocalIsFavorite(isFavoriteFromCache);
  }, [isFavoriteFromCache]);

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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previousFavorites = queryClient.getQueryData<FavoriteMovieResponse[]>(["favorites"]);

      queryClient.setQueryData<FavoriteMovieResponse[]>(
        ["favorites"],
        (old = []) => {
          if (old.some((fav) => fav.movieId === movieIdStr)) {
            return old.filter((fav) => fav.movieId !== movieIdStr);
          } else {
            const newFav = { movieId: movieIdStr, title: movie.title, poster_path: movie.poster_path } as FavoriteMovieResponse;
            return [...old, newFav];
          }
        },
      );
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
        // 💡 에러 발생 시 로컬 상태도 기존 찜 상태로 롤백
        setLocalIsFavorite(context.previousFavorites.some((fav) => fav.movieId === movieIdStr));
      }
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  if (!session) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Heart className="h-4 w-4" /> 로그인 후 찜하기
      </Button>
    );
  }

  // 💡 버튼을 클릭했을 때의 동작 함수
  const handleToggle = () => {
    setLocalIsFavorite(!localIsFavorite); // 1. 누르자마자 0ms만에 하트 불빛 반전
    toggleFavoriteMutation.mutate();      // 2. 서버 통신은 백그라운드에서 조용히 실행
  };

  return (
    <Button
      variant={localIsFavorite ? "default" : "outline"} // 💡 캐시 대신 localIsFavorite 기준 렌더링
      className={`gap-2 transition-colors ${
        localIsFavorite ? "bg-red-500 text-white hover:bg-red-600 border-red-500" : ""
      }`}
      // ❌ disabled={toggleFavoriteMutation.isPending} 을 과감히 제거하여 버튼 잠김 현상 방지
      onClick={handleToggle}
    >
      <Heart className={`h-4 w-4 ${localIsFavorite ? "fill-current text-white" : ""}`} />
      {localIsFavorite ? "찜 완료" : "내 보관함에 저장"}
    </Button>
  );
}