import { MovieResponse } from '@/type/movie';
import { MovieDetailResponse } from '@/type/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = process.env.TMDB_API_KEY;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getPopularMovies(): Promise<MovieResponse> {
  // [최적화 측정 포인트] Next.js의 fetch 캐싱(revalidate)을 활용합니다. 
  // 배포 후 데이터 갱신 주기와 LCP 등을 측정해 캐싱 시간을 조절할 수 있습니다.
  // await delay(800); 
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/popular?language=ko-KR&page=1&api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('인기 영화 목록을 불러오는데 실패했습니다.');
  }

  return res.json();
}



export async function getMovieDetail(id: string): Promise<MovieDetailResponse> {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?language=ko-KR&api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('영화 상세 정보를 불러오는데 실패했습니다.');
  }

  return res.json();
}