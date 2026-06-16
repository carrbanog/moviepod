import Image from "next/image";
import { User } from "next-auth";

interface ProfileCardProps {
  user: Pick<User, "name" | "email" | "image">;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-6">
      {user?.image ? (
        <Image
          src={user.image}
          alt={`${user.name ?? "유저"}'s profile picture`}
          width={80}
          height={80}
          className="rounded-full border"
          priority // [최적화 측정 포인트] 프로필 이미지가 FCP/LCP에 미치는 영향 최적화
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          No Image
        </div>
      )}

      {/* 유저 정보 렌더링 */}
      <div>
        <h2 className="text-2xl font-semibold">{user.name ?? "이름 없음"}</h2>
        <p className="text-muted-foreground">
          {user.email ?? "이메일 정보 없음"}
        </p>
      </div>
    </section>
  );
}
