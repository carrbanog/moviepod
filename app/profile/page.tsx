
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProfileCard from "@/components/domain/profile/ProfileCard";
import FavoriteMoviesList from "@/components/domain/profile/FavoriteMoviesList";



export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/?error=login_required");
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">내 프로필</h1>
      
      
      <ProfileCard user={session.user!} />
      <FavoriteMoviesList />
    </div>
  );
}