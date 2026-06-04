export interface Movie {
  id: number;
  title: string;
  poster_path: string;  // 영화 포스터 이미지 경로
  release_date: string; // 영화 개봉일
  vote_average: number; // 영화 평점 (0~10)
  overview: string;     // 영화 줄거리
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetailResponse extends Movie {
  genres: { id: number; name: string }[]; // 영화 장르 정보
  runtime: number; // 영화 상영 시간 (분)
  tagline: string; // 영화 태그라인 (짧은 슬로건)
}