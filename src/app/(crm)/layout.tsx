import Link from "next/link";
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
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-semibold">
              Mini CRM
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>

              <Link
                href="/leads"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Leads
              </Link>

              <Link
                href="/pipeline"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pipeline
              </Link>
            </nav>
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
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}