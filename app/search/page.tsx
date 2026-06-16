import { Suspense } from "react";
import SearchResultList from "@/components/domain/search/SearchResultList";
import MovieListSkeleton from "@/components/domain/movie/MovieListSkeleton";

export default async function SearchResultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;

  if (!query) {
    return (
      <section className="container mx-auto py-20 text-center text-muted-foreground">
        <p>검색어를 입력해주세요.</p>
      </section>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold">"{query}" 검색 결과</h1>

      <Suspense
        key={query}
        fallback={<MovieListSkeleton count={10} showTitle={true} />}
      >
        <SearchResultList query={query} />
      </Suspense>
    </main>
  );
}
