// app/movie/[id]/page.tsx
import Image from "next/image";
import { getMovieDetail } from "@/services/tmdb";
import MovieDetail from "@/components/domain/movie/MovieDetail";
import MovieDetailSkeleton from "@/components/domain/movie/MovieDetailSkeleton";
import { Suspense } from "react";

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params;

  return (
    <main className="container mx-auto px-4 pt-10 pb-5">
      <Suspense fallback={<MovieDetailSkeleton />}>
        <MovieDetail id={id} />
      </Suspense>
    </main>
  );
}
