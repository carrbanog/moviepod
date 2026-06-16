import PopularMovieList from "@/components/domain/movie/PopularMovieList";
import { Suspense } from "react";
import MovieListSkeleton from "@/components/domain/movie/MovieListSkeleton";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-10">
      {/* 기존 환영 문구 영역 */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Moviepod에 오신 것을 환영합니다
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          기본기에 충실한 매끄러운 영화 추천 및 탐색 플랫폼
        </p>
      </div>

      {/* 인기 영화 섹션 */}
      <section className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          요즘 뜨는 인기 영화
        </h2>
        <Suspense fallback={<MovieListSkeleton count={10} showTitle={false} />}>
          <PopularMovieList />
        </Suspense>
      </section>
    </main>
  );
}
