
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

export default async function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div>
          <h1 className="font-semibold">Mini CRM</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user.name}
          </span>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm font-medium hover:underline"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}