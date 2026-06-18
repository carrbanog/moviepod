import PopularMovieList from "@/components/domain/home/PopularMovieList";
import FavortieGenreContainer from "@/components/domain/home/FavoriteGenreContainer";
import { Suspense } from "react";
import MovieListSkeleton from "@/components/domain/movie/MovieListSkeleton";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="container mx-auto px-4 py-10">
      {/* 기존 환영 문구 영역 */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Moviepod에 오신 것을 환영합니다
        </h1>
      </div>

      {/* 인기 영화 섹션 */}
      <section className="mt-8 space-y-6 ">
        <h2 className="text-2xl font-bold tracking-tight">
          요즘 뜨는 인기 영화
        </h2>
        <Suspense fallback={<MovieListSkeleton count={10} showTitle={false} />}>
          <PopularMovieList />
        </Suspense>
      </section>

      {/* 유저 맞춤 장르 영역 */}
      {session?.user?.email && (
        <Suspense fallback={<MovieListSkeleton count={5} showTitle={false} />}>
          <FavortieGenreContainer
            email={session.user.email}
            userName={session.user.name || "유저"}
          />
        </Suspense>
      )}
    </main>
  );
}
