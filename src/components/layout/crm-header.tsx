"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type CRMHeaderProps = {
  userName: string;
};

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/leads",
    label: "Leads",
  },
  {
    href: "/pipeline",
    label: "Pipeline",
  },
];

export function CRMHeader({ userName }: CRMHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/dashboard"
          onClick={closeMenu}
          className="text-base font-semibold tracking-tight"
        >
          Mini CRM
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop user actions */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="max-w-40 truncate text-sm text-muted-foreground">
            {userName}
          </span>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="border-t md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="my-2 border-t" />

              <div className="px-3 py-2">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  CRM account
                </p>
              </div>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Logout
                </button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}