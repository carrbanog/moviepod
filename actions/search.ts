"use server";

import { searchMovies } from "@/services/tmdb"; // 💡 이미 만들어둔 도구를 가져옵니다.
import { Movie } from "@/type/movie";

// 검색어 자동 완성
export async function liveSearchAction(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];

  try {
    const results = await searchMovies(query);
    return results;
  } catch (error) {
    console.error("라이브 검색 액션 에러:", error);
    return [];
  }
}
