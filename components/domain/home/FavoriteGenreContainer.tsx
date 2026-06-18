import { getUserGenreStats } from "@/services/user";
import ErrorFallback from "@/components/domain/layout/ErrorFallback";
import FavoriteGenreMovieList from "@/components/domain/home/FavoriteGenreMovieList";

interface FavoriteGenreContainerProps {
  email: string;
  userName: string;
}

export default async function FavortieGenreContainer({
  email,
  userName,
}: FavoriteGenreContainerProps) {
  try {
    const genreStats = await getUserGenreStats(email);
    if (genreStats.length === 0) return null;
    const topGenre = genreStats[0];

    return (
      <section className="mt-16 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {userName}님이 좋아하는 {topGenre.name} 장르 맞춤 추천 🎬
        </h2>

        <FavoriteGenreMovieList genreId={topGenre.id} />
      </section>
    );
  } catch (error) {
    return (
      <section className="mt-16">
        <ErrorFallback message="맞춤 추천 장르를 불러오는 중 오류가 발생했습니다." />
      </section>
    );
  }
}
