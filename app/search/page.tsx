import { Suspense } from "react";
import SearchResultList from "@/components/domain/search/SearchResultList";
import SearchResultSkeleton from "@/components/domain/search/SearchResultSkeleton";

export default async function SearchResultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;

  if (!query) {
    return (
      <div className="container mx-auto py-20 text-center text-muted-foreground">
        검색어를 입력해주세요.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold">
        "{query}" 검색 결과
      </h1>

      <Suspense key={query} fallback={<SearchResultSkeleton />}>
        <SearchResultList query={query} />
      </Suspense>
    </div>
  );
}