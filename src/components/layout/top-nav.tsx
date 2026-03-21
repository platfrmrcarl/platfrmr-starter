"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

const workspaceLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/account", label: "Account" },
];

export function TopNav() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const photoUrl = user?.photoURL ?? profile?.photoURL ?? "";
  const displayName = user?.displayName ?? profile?.displayName ?? profile?.email ?? "User";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          Platform
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("#")[0]);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm bg-white font-medium transition",
                  isActive
                    ? "bg-sky-100 text-sky-800"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                {photoUrl ? (
                  <span
                    aria-hidden="true"
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${photoUrl})` }}
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-700">{initial}</span>
                )}
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                    <p className="truncate text-xs text-slate-500">{profile?.email ?? user.email ?? ""}</p>
                  </div>

                  <div className="py-2">
                    {workspaceLinks.map((link) => {
                      const isActive = pathname === link.href;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "block rounded-xl px-3 py-2 text-sm font-medium transition",
                            isActive
                              ? "bg-sky-100 text-sky-800"
                              : "text-slate-700 hover:bg-slate-100",
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 px-1 pt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsMenuOpen(false);
                        await logout();
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
