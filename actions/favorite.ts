"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ToggleFavoritePayload, FavoriteMovieResponse } from '@/type/movie';

// 찜한 영화 목록 조회
export async function getFavoritesActions() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return [];
    }
    await connectDB();
    const userWithFavorites = await User.findOne(
      { email: session.user.email },
      { favorites: 1 },
    ).lean();
    const favoriteMovies = userWithFavorites?.favorites || [];

    return JSON.parse(JSON.stringify(favoriteMovies));
  } catch (error) {
    console.error("찜한 영화 목록 조회 에러:", error);
    throw new Error("서버 내부 에러가 발생했습니다.");
  }
}

//
export async function toggleFavoriteAction(movie: ToggleFavoritePayload) { 
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

    if (!movie) {
      throw new Error("영화 정보가 누락되었습니다.");
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const movieIdStr = String(movie.id);
    const existingIndex = user.favorites.findIndex((fav: FavoriteMovieResponse) => fav.movieId === movieIdStr);

    if (existingIndex > -1) {
      // 이미 존재하면 삭제 (찜 해제)
      user.favorites.splice(existingIndex, 1);
    } else {
      // 존재하지 않으면 추가 (찜하기)
      user.favorites.push({
        movieId: movieIdStr,
        title: movie.title,
        poster_path: movie.poster_path,
        genres: movie.genres || [],
        release_date: movie.release_date,
      });
    }

    await user.save();
    
    return JSON.parse(JSON.stringify(user.favorites));
  } catch (error: any) {
    console.error("찜하기 토글 에러:", error);
    throw new Error(error.message || "서버 내부 에러가 발생했습니다.");
  }
}