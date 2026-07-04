// 제네릭을 사용해서 tmdb 요청을 처리하는 fetch 함수

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function tmdbFetch<T>(endpoint: string, options?: RequestInit, errorMessage = "데이터를 불러오는데 실패했습니다."): Promise<T> {
  const res = await fetch(`${TMDB_BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}
