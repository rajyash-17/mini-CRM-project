"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type CRMHeaderProps = {
  userName: string;
};

export function CRMHeader({ userName }: CRMHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="font-semibold"
          onClick={closeMenu}
        >
          Mini CRM
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
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

        {/* Desktop user actions */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="text-sm text-muted-foreground">
            {userName}
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

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="border-t md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-1">
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Dashboard
              </Link>

              <Link
                href="/leads"
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Leads
              </Link>

              <Link
                href="/pipeline"
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Pipeline
              </Link>

              <div className="my-2 border-t" />

              <div className="px-3 py-2 text-sm text-muted-foreground">
                {userName}
              </div>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-muted"
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