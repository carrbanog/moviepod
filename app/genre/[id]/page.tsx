import { Suspense } from "react";
import MovieListSkeleton from "@/components/domain/movie/MovieListSkeleton";
import GenreSearchContainer from "@/components/domain/genre/GenreSearchContainer";

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name: string }>;
}) {
  // 최신 Next.js 버전에서는 params와 searchParams를 await로 풀어주어야 합니다.
  const { id } = await params;
  const { name } = await searchParams;

  // 장르 이름이 주소창에 없으면 기본값으로 '영화'를 보여줍니다.
  const genreName = name || "영화";

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold">"{genreName}" 장르 검색 결과</h1>
      <Suspense
        key={id}
        fallback={<MovieListSkeleton count={10} showTitle={true} />}
      >
        <GenreSearchContainer genreId={id} />
      </Suspense>
    </div>
  );
}
