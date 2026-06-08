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
    <div className="container mx-auto px-4 py-10">
      <Suspense fallback={<MovieDetailSkeleton />}>
        <MovieDetail id={id} />
      </Suspense>
    </div>
  );
}
