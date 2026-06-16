// src/services/user.ts
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { FavoriteMovieResponse } from "@/type/movie";

// 💡 반환 타입을 number 단일 값에서 객체 형태로 변경합니다.
export async function getTopFavoriteGenre(
  email: string,
): Promise<{ id: number; name: string } | null> {
  await connectDB();

  try {
    const user = await User.findOne({ email }).select("favorites").lean();

    if (!user || !user.favorites || user.favorites.length === 0) {
      return null;
    }

    // 2. 장르 ID를 Key로 하여, 횟수(count)와 이름(name)을 함께 추적할 빈 객체 생성
    const genreStats: Record<number, { id: number; name: string; count: number }> = {};

    user.favorites.forEach((movie: FavoriteMovieResponse) => {
      movie.genres.forEach((genre: any) => {
        const genreId = genre.id || genre; 
        const genreName = genre.name || "알 수 없는 장르"; // 혹시 name이 없을 경우의 방어 코드

        // 사전에 해당 장르가 처음 나왔다면 초기화
        if (!genreStats[genreId]) {
          genreStats[genreId] = { id: genreId, name: genreName, count: 0 };
        }
        
        // 등장 횟수 1 증가
        genreStats[genreId].count += 1;
      });
    });

    // 객체의 값들만 뽑아서 배열로 만듦 (예: [{id: 28, name: "액션", count: 3}, ...])
    const statsArray = Object.values(genreStats);
    
    if (statsArray.length === 0) return null;
    console.log("user요청 장르 빈도수 통계", genreStats);

    // 3. 배열을 순회하며 count가 가장 높은 객체(최빈값) 하나를 뽑아냄
    const topGenre = statsArray.reduce((prev, current) => 
      current.count > prev.count ? current : prev
    );

    console.log("user요청 가장 좋아하는 장르", topGenre);

    // 4. 결과적으로 횟수(count)는 빼고 꼭 필요한 id와 name만 넘겨줍니다.
    return {
      id: topGenre.id,
      name: topGenre.name
    };
    
  } catch (error) {
    console.error("유저 즐겨찾기 장르 분석 중 오류 발생:", error);
    return null;
  }
}