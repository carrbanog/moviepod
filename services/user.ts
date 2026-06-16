// src/services/user.ts
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { FavoriteMovieResponse } from "@/type/movie";

// 파라미터를 userId에서 email로 변경합니다.
export async function getTopFavoriteGenre(
  email: string,
): Promise<number | null> {
  await connectDB();

  try {
    // 1. 이메일을 기준으로 유저 정보와 favorites 배열 가져오기
    const user = await User.findOne({ email }).select("favorites").lean();

    if (!user || !user.favorites || user.favorites.length === 0) {
      return null;
    }

    // 2. 모든 영화의 장르 ID를 하나의 배열로 모으기
    const allGenreIds = user.favorites.flatMap((movie: FavoriteMovieResponse) =>
      movie.genres.map((genre: any) => genre.id || genre),
    );

    if (allGenreIds.length === 0) return null;
    console.log("user요청 모든 장르 불러오기", allGenreIds);
    // 3. 장르별 등장 빈도수 계산
    const genreCounts = allGenreIds.reduce(
      (acc: Record<number, number>, id: number) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      },
      {},
    );
    console.log("user요청 장르 빈도수 계산", genreCounts);
    // 4. 가장 많이 등장한(최빈값) 장르 ID 찾기
    const topGenreId = Object.keys(genreCounts).reduce((a, b) =>
      genreCounts[Number(a)] > genreCounts[Number(b)] ? a : b,
    );
    console.log("user요청 장르 최빈값", topGenreId);
    return Number(topGenreId);
  } catch (error) {
    console.error("유저 즐겨찾기 장르 분석 중 오류 발생:", error);
    return null;
  }
}
