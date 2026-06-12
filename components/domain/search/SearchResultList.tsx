import MovieCard from "@/components/domain/movie/MovieCard";
import { Movie } from "@/type/movie";


export default async function SearchResultList({ query }: { query: string }) {
  const API_KEY = process.env.TMDB_API_KEY;
  let movies = [];
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&page=1&api_key=${API_KEY}`,
      {
        cache: "no-store",
      },
    );

    const data = await res.json();
    movies = data.results;
  } catch (error) {
    console.error(error);
    return (
      <div className="py-20 mt-8 text-center text-red-500 border border-red-200 border-dashed rounded-xl bg-red-50/50">
        데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-20 mt-8 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/20">
        검색 결과가 없습니다. 다른 검색어로 시도해보세요.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-6 text-muted-foreground text-sm font-normal">
        총 {movies.length}개의 결과를 찾았습니다.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie: Movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
          />
        ))}
      </div>
    </div>
  );
}
