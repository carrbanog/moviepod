import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }
    console.log("Session in GET /api/favorites:", session); // 디버깅용 로그
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    return NextResponse.json({ favorites: user?.favorites || [] });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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