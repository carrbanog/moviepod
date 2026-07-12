// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/services/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || !query.trim()) {
    return NextResponse.json([]);
  }

  try {
    // Next.js 서버가 브라우저의 취소 신호(signal)를 감지할 수 있도록 전달
    const signal = request.signal; 
    const results = await searchMovies(query, { signal });
    return NextResponse.json(results);
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("서버: 브라우저가 요청을 취소하여 TMDB 페칭을 중단합니다.");
    } else {
      console.error("라이브 검색 API 에러:", error);
    }
    return NextResponse.json([]);
  }
}