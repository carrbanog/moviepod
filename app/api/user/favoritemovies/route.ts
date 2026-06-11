import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    await connectDB();
    const userWithFavorites = await User.findOne(
      { email: session.user.email },
      { favorites: 1 },
    ).lean();

    if (!userWithFavorites) {
      return NextResponse.json(
        { error: "유저를 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    const favoriteMovies = userWithFavorites.favorites || [];
    return NextResponse.json( favoriteMovies );
  } catch (error) {
    console.error("찜한 영화 목록 조회 API 에러:", error);
    return NextResponse.json(
      { error: "서버 내부 에러가 발생했습니다." },
      { status: 500 },
    );
  }
}
