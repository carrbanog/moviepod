import MovieCard from "@/components/domain/movie/MovieCard";
import { Movie } from "@/type/movie";
import ErrorFallback from "@/components/domain/layout/ErrorFallback";

export default async function GenreMovieList({ genreId }: { genreId: string }) {
  const API_KEY = process.env.TMDB_API_KEY;
  let movies: Movie[] = [];

  try {
    // 💡 1. 1페이지부터 5페이지까지 동시에 요청을 보낼 준비를 합니다.
    const pageRequests = Array.from({ length: 5 }, (_, i) => i + 1).map((page) =>
      fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=ko-KR&page=${page}&sort_by=popularity.desc&api_key=${API_KEY}`,
        {
          cache: "no-store",
        },
      ).then((res) => {
        if (!res.ok) throw new Error("TMDB API 에러");
        return res.json();
      })
    );

    // 💡 2. Promise.all을 사용해 5개의 요청을 동시에 날리고, 모두 도착할 때까지 기다립니다.
    const pagesData = await Promise.all(pageRequests);

    // 💡 3. [배열 5개]로 나뉘어 있는 결과물들을 하나의 배열(100개)로 평평하게(flatMap) 합칩니다.
    movies = pagesData.flatMap((data) => data.results);

  } catch (error) {
    console.error(error);
    return <ErrorFallback message="서버 통신 중 문제가 발생했습니다." />;
  }

  if (movies.length === 0) {
    return (
      <div className="py-20 mt-8 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/20">
        해당 장르의 영화를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-6 text-muted-foreground text-sm font-normal">
        총 {movies.length}개의 결과를 찾았습니다.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {/* 💡 방금 전에 배운 LCP 최적화(priority)까지 함께 적용했습니다! */}
        {movies.map((movie: Movie, index: number) => (
          <MovieCard
            key={`${movie.id}-${index}`} // 가끔 TMDB API가 중복된 영화를 줄 수 있어 index를 섞어 key 충돌을 방지합니다.
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
          />
        ))}
      </div>
    </div>
  );
}