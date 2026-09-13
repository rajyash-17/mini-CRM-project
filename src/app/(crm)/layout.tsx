
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { CRMHeader } from "@/components/layout/crm-header";

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
      <CRMHeader userName={user.name} />

      <main>{children}</main>
    </div>
  );
}