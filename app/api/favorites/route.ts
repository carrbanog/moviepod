import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 }); 
    }

    await connectDB();
    const userWithFavorites = await User.findOne(
      { email: session.user.email },
      { favorites: 1 }
    ).lean();

    const favoriteMovies = userWithFavorites?.favorites || [];
    
    // 배열 자체를 반환하여 프론트엔드 매핑을 쉽게 만듭니다.
    return NextResponse.json(favoriteMovies);
  } catch (error) {
    console.error("찜한 영화 목록 조회 API 에러:", error);
    return NextResponse.json(
      { error: "서버 내부 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try{
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    const {movie} = await request.json();
    if (!movie) {
      return NextResponse.json({ error: "영화 정보가 누락되었습니다." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    const movieIdStr = String(movie.id);
    const existingIndex = user.favorites.findIndex((fav:any) => fav.movieId === movieIdStr);

    if(existingIndex > -1) {
      user.favorites.splice(existingIndex, 1);
    }
    else{
      user.favorites.push({
        movieId: movieIdStr,
        title: movie.title,
        poster_path: movie.poster_path,
        genres: movie.genres || [],
        release_date: movie.release_date,
      })
    }
    console.log("Updated favorites for user:", user); // 디버깅용 로그
    await user.save();
    return NextResponse.json({ favorites: user.favorites });
  }
  catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}