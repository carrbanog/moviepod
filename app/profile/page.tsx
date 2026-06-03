
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { toast } from 'sonner';

export default async function ProfilePage() {
  // 1. AuthButton에서 넘겨받는 것이 아니라, 여기서 직접 세션을 꺼냅니다.
  const session = await getServerSession(authOptions);

  // 2. 만약 로그인을 안 했는데 주소창에 /profile을 치고 들어오면 메인으로 쫓아냅니다.
  if (!session) {
    redirect("/?error=login_required");
  }

  // 3. session.user 안에는 기본적으로 name, email, image가 들어있습니다.
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">내 프로필</h1>
      
      <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-6">
        {/* 유저 프로필 이미지 (구글 로그인 시 제공됨) */}
        {session.user?.image ? (
          <img 
            src={session.user.image} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}

        {/* 유저 정보 렌더링 */}
        <div>
          <p className="text-2xl font-semibold">{session.user?.name}</p>
          <p className="text-muted-foreground">{session.user?.email}</p>
        </div>
      </div>
    </div>
  );
}