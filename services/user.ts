// src/services/user.ts
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { FavoriteMovieResponse, GenreStat } from "@/type/movie";


// 💡 반환 타입을 number 단일 값에서 객체 형태로 변경합니다.

export async function getUserGenreStats(
  email: string,
): Promise<GenreStat[]> { // 💡 단일 객체가 아닌 배열을 반환
  await connectDB();

  try {
    const user = await User.findOne({ email }).select("favorites").lean();

    if (!user || !user.favorites || user.favorites.length === 0) {
      return [];
    }

    const genreStats: Record<number, GenreStat> = {};

    user.favorites.forEach((movie: FavoriteMovieResponse) => {
      movie.genres.forEach((genre: any) => {
        const genreId = genre.id || genre; 
        const genreName = genre.name || "알 수 없는 장르";

        if (!genreStats[genreId]) {
          genreStats[genreId] = { id: genreId, name: genreName, count: 0 };
        }
        
        genreStats[genreId].count += 1;
      });
    });

    const statsArray = Object.values(genreStats);
    console.log("장르 반환", statsArray)
    // 💡 빈도수(count)가 높은 순서대로 내림차순 정렬하여 반환합니다.
    return [...statsArray].sort((a, b) => b.count - a.count);
    
  } catch (error) {
    console.error("유저 즐겨찾기 장르 분석 중 오류 발생:", error);
    return [];
  }
}