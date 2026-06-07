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