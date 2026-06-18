// src/components/domain/profile/GenreChartContainer.tsx
import { getUserGenreStats } from "@/services/user";
import GenreChart from "./GenreChart";
import ErrorFallback from "@/components/domain/layout/ErrorFallback"

interface GenreChartContainerProps {
  email: string;
}

export default async function GenreChartContainer({ email }: GenreChartContainerProps) {
  try {
    const genreStats = await getUserGenreStats(email);
    const topGenre = genreStats.slice(0, 5);

    return <GenreChart data={topGenre} />;
  } catch (error) {
    console.error("차트 영역 에러:", error);
    return <ErrorFallback message="유저 장르 데이터를 분석하는 중 오류가 발생했습니다." />;
  }
}