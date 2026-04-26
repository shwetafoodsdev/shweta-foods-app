import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="mt-8 max-w-xl">
      <h1 className="h2-bold mb-4">User Profile</h1>
      <div className="rounded border p-4 space-y-2">
        <p><span className="font-semibold">Name:</span> {session.user.name}</p>
        <p><span className="font-semibold">Email:</span> {session.user.email}</p>
        <p><span className="font-semibold">Role:</span> {session.user.role}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
