import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">
        Welcome, {user.name}
      </h1>

      <p className="mt-2 text-muted-foreground">
        You are logged in as {user.email}.
      </p>
    </main>
  );
}