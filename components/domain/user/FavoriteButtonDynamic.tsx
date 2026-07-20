// components/domain/user/FavoriteButtonDynamic.tsx
"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { ToggleFavoritePayload } from "@/type/movie"; // movie props 타입에 맞게 import

// 💡 여기서 dynamic import와 ssr: false를 적용합니다.
const FavoriteButton = dynamic(
  () => import("@/components/domain/user/FavoriteButton"),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="outline"
        disabled
        className="gap-2 animate-pulse text-muted-foreground"
      >
        <Heart className="h-4 w-4" /> 정보를 불러오는 중...
      </Button>
    ),
  }
);

interface FavoriteButtonDynamicProps {
  movie: ToggleFavoritePayload;
}

export default function FavoriteButtonDynamic({ movie }: FavoriteButtonDynamicProps) {
  return <FavoriteButton movie={movie} />;
}