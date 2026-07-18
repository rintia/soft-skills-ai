"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, LogOut, User, LayoutDashboard, BookOpen } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  const user = sessionData?.user;
  // Fallback check: if email is admin@example.com or user role is admin
  const isAdmin = (user as any)?.role === "admin" || user?.email === "admin@example.com";

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Explore", href: "/courses" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const activeClass = (href: string) =>
    pathname === href
      ? "text-teal-600 dark:text-teal-400 font-semibold"
      : "text-muted-foreground hover:text-foreground transition-colors";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-500/20">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-200 bg-clip-text text-transparent">
                Soft Skills Mastery
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`text-sm font-medium ${activeClass(link.href)}`}>
                {link.name}
              </Link>
            ))}

            {user && (
              <>
                <Link href="/my-courses" className={`text-sm font-medium ${activeClass("/my-courses")}`}>
                  My Courses
                </Link>
                {isAdmin && (
                  <Link href="/courses/manage" className={`text-sm font-medium flex items-center gap-1.5 ${activeClass("/courses/manage")}`}>
                    <LayoutDashboard className="h-4 w-4" />
                    Manage Catalog
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Controls / Auth */}
          <div className="hidden md:flex items-center gap-4 ml-6">
            {!isPending && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border">
                  <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                    {user.name || user.email.split("@")[0]}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] uppercase font-extrabold bg-teal-500/20 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1 text-muted-foreground hover:text-red-500">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : !isPending ? (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pt-2 pb-4 space-y-2 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-muted"
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <>
              <Link
                href="/my-courses"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-muted"
              >
                My Courses
              </Link>
              {isAdmin && (
                <Link
                  href="/courses/manage"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-muted text-teal-600 dark:text-teal-400 font-semibold"
                >
                  Manage Catalog
                </Link>
              )}
              <div className="border-t border-border my-2 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground">
                  <User className="h-4 w-4 text-teal-600" />
                  <span>{user.name || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left rounded-lg px-3 py-2 text-base font-medium text-red-500 hover:bg-red-500/5 mt-1"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}

          {!user && !isPending && (
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 mt-2">
              <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full h-10">Sign In</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                <Button className="w-full h-10">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
