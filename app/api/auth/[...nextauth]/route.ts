import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  // 💡 콜백 규칙 추가
  callbacks: {
    async signIn({ user, account }) {
      console.log("signIn 콜백 호출, user:", user, "account:", account);
      if (account?.provider === "google" && user.email) {
        try {
          await connectDB(); // 1단계에서 만든 DB 연결 함수 호출

          await User.findOneAndUpdate(
            { email: user.email },
            {
              name: user.name,
              image: user.image,
              provider: account.provider,
            },
            { upsert: true, new: true } // 없으면 생성 옵션
          );
          
          return true; // 로그인을 계속 진행합니다.
        } catch (error) {
          console.error("로그인 중 DB 유저 저장 에러:", error);
          return false; // 에러 발생 시 로그인을 거부하여 예외 처리
        }
      }
      return true;
    },
    
    // [성능 측정 포인트]: 클라이언트 컴포넌트나 세션 호출 시 유저의 DB 전용 ID(_id)를 
    // 쉽게 꺼내 쓸 수 있도록 session 객체에 주입해 두는 것이 나중의 API 호출 최적화에 유리합니다.
    async session({ session, token }) {
      return session;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };