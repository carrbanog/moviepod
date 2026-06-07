'use client';
import {useSession} from 'next-auth/react';
import { Button } from '@/components//ui/button';
import { Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { FavoriteMovieResponse } from '@/type/movie';

export default function FavoriteButton() {
  const {data: session} = useSession();

const { data: favorites = [] } = useQuery<FavoriteMovieResponse[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();
      console.log("Fetched favorites:", data); // 디버깅용 로그
      return data.favorites;
    },
    enabled: !!session?.user, // 로그인 상태일 때만 실행
  });
  console.log("Current favorites in FavoriteButton:", favorites); // 디버깅용 로그
  if (!session) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Heart className="h-4 w-4" /> 로그인 후 찜하기
      </Button>
    )
  }

  return(
    <Button variant="outline" className="gap-2">
      <Heart className="h-4 w-4" /> 찜하기
    </Button>
  )
}