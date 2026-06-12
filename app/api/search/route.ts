// app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const API_KEY = process.env.TMDB_API_KEY;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&page=1&api_key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("TMDB 검색 실패");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "검색 중 오류 발생" }, { status: 500 });
  }
}