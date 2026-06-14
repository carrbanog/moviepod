import { MovieResponse } from '@/type/movie';
import { MovieDetailResponse, FavoriteMovieResponse } from '@/type/movie';

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

// 영화 검색
export async function searchMovies(query: string) {
  const API_KEY = process.env.TMDB_API_KEY;
  
  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&page=1&api_key=${API_KEY}`,
    { cache: "no-store" } // 검색 결과는 실시간성이 중요하므로 캐싱하지 않음
  );

  // 💡 API 통신 자체에 문제가 생기면 컴포넌트로 에러를 던집니다.
  if (!res.ok) {
    throw new Error('검색 결과를 가져오는데 실패했습니다.');
  }

  const data = await res.json();
  return data.results; // 💡 컴포넌트가 바로 쓰기 편하게 배열만 쏙 뽑아서 리턴!
}

//장르 검색
export async function getMoviesByGenre(genreId: string) {
  const pageRequests = Array.from({ length: 5 }, (_, i) => i + 1).map((page) =>
    fetch(
      `${TMDB_BASE_URL}/discover/movie?with_genres=${genreId}&language=ko-KR&page=${page}&sort_by=popularity.desc&api_key=${API_KEY}`,
      { cache: "no-store" }
    ).then((res) => {
      if (!res.ok) throw new Error("TMDB API 에러");
      return res.json();
    })
  );

  const pagesData = await Promise.all(pageRequests);

  return pagesData.flatMap((data) => data.results);
}

// 좋아요 리스트
export async function getFavoriteMovies(): Promise<FavoriteMovieResponse[]> {
  const res = await fetch("/api/favorites");

  // 💡 컴포넌트 내부에 있던 복잡한 에러 핸들링 로직이 이쪽으로 이사 왔습니다.
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || "데이터를 처리하는 중 오류가 발생했습니다.");
    } catch (jsonError) {
      // JSON 파싱에 실패했을 때 (HTML 에러 페이지가 왔을 때)의 방어선
      if (res.status === 404) {
        throw new Error("요청하신 서비스를 찾을 수 없습니다. (404)");
      }
      throw new Error("서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
    }
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

// 영화 예고편
export async function getMovieTrailer(id: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/videos?language=ko-KR&api_key=${API_KEY}`,
      { next: { revalidate: 3600 } } // 기존 코드와 동일하게 1시간 캐싱 적용
    );

    if (!res.ok) throw new Error();
    let data = await res.json();
    if (!data.results || data.results.length === 0) {
      const enRes = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/videos?language=en-US&api_key=${API_KEY}`,
        { next: { revalidate: 3600 } }
      );
      if (enRes.ok) {
        data = await enRes.json();
      }
    }
    console.log("tmdb 요청 트레일러 데이터", data)

    const trailer = data.results?.find(
      (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
    );

    const fallbackVideo = data.results?.find((vid: any) => vid.site === "YouTube");

    return trailer ? trailer.key : fallbackVideo ? fallbackVideo.key : null;
  } catch (error) {
    console.error("영화 예고편 정보를 불러오는데 실패했습니다:", error);
    return null;
  }
}