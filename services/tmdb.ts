"use server";

import { MovieResponse, Movie } from "@/type/movie";
import { MovieDetailResponse } from "@/type/movie";
import { tmdbFetch } from "@/lib/tmdbClient";


const API_KEY = process.env.TMDB_API_KEY;

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>(
    `/movie/popular?language=ko-KR&page=1&api_key=${API_KEY}`,
    { next: { revalidate: 3600 } },
    "인기 영화 목록을 불러오는데 실패했습니다."
  );
  return data.results;
}

// 영화 검색
export async function searchMovies(query: string, options?: { signal?: AbortSignal }): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>(
    `/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&page=1&api_key=${API_KEY}`,
    { 
      cache: "no-store",
      signal: options?.signal
    },
    "검색 결과를 가져오는데 실패했습니다."
  );
  return data.results;
}

export async function getMoviesByGenre(
  genreId: string,
  page: number,
): Promise<Movie[]> {
  const data = await tmdbFetch<MovieResponse>(
    `/discover/movie?with_genres=${genreId}&language=ko-KR&page=${page}&sort_by=popularity.desc&api_key=${API_KEY}`,
    // { next: { revalidate: 3600 } },
    { cache: 'no-store' },
    "장르별 영화 목록을 불러오는데 실패했습니다."
  );
  
  return data.results;
}

export async function getMovieDetail(id: string): Promise<MovieDetailResponse> {
  return tmdbFetch<MovieDetailResponse>(
    `/movie/${id}?language=ko-KR&api_key=${API_KEY}`,
    // { next: { revalidate: 3600 } },
    { cache: 'no-store' },
    "영화 상세 정보를 불러오는데 실패했습니다."
  );
}

// 영화 예고편
export async function getMovieTrailer(id: string): Promise<string | null> {
  try {
    // 한국어 예고편 데이터 요청 (에러 발생 시 catch 블록으로 이동하도록 메시지 생략 가능)
    let data = await tmdbFetch<any>(
      `/movie/${id}/videos?language=ko-KR&api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    // 한국어 결과가 없거나 비어있다면 영어 데이터로 재요청
    if (!data.results || data.results.length === 0) {
      data = await tmdbFetch<any>(
        `/movie/${id}/videos?language=en-US&api_key=${API_KEY}`,
        { next: { revalidate: 3600 } }
      );
    }

    // 유튜브 예고편(Trailer) 찾기
    const trailer = data.results?.find(
      (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
    );

    // 예고편이 없다면 유튜브 영상 아무거나 대체재(Fallback)로 선택
    const fallbackVideo = data.results?.find(
      (vid: any) => vid.site === "YouTube"
    );

    return trailer ? trailer.key : fallbackVideo ? fallbackVideo.key : null;
  } catch (error) {
    // tmdbFetch 내부에서 404나 500 에러가 나더라도 트레일러는 화면을 깨뜨리면 안 되므로 
    // 에러를 상위로 던지지 않고(throw) null을 안전하게 반환합니다.
    console.error("영화 예고편 정보를 불러오는데 실패했습니다:", error);
    return null;
  }
}