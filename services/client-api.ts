import {FavoriteMovieResponse} from "@/type/movie"

// 좋아요 리스트
export async function getFavoriteMovies(): Promise<FavoriteMovieResponse[]> {
  const res = await fetch("/api/favorites", { method: "GET" });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(
        errorData.error || "데이터를 처리하는 중 오류가 발생했습니다.",
      );
    } catch (jsonError) {
      if (res.status === 404) {
        throw new Error("요청하신 서비스를 찾을 수 없습니다. (404)");
      }
      throw new Error(
        "서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.",
      );
    }
  }

  return res.json();
}