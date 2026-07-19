"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, MessageSquare, Shield, ArrowRight, Home } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const quotes = [
  {
    text: "Leadership is not about being in charge. It is about taking care of those in your charge.",
    author: "Simon Sinek",
    tag: "Leadership"
  },
  {
    text: "The most important thing in communication is hearing what isn't said.",
    author: "Peter Drucker",
    tag: "Communication"
  },
  {
    text: "Emotional intelligence is the ability to make emotions work for you, instead of against you.",
    author: "Justin Bariso",
    tag: "Emotional Intelligence"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Quote carousel rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials");
      } else {
        toast("Logged in successfully! Welcome back.", "success");
        router.push("/courses");
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "user" | "admin") => {
    setError("");
    setDemoLoading(role);

    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        toast(`Demo login successful! Logged in as ${role === "admin" ? "Admin" : "Learner"}.`, "success");
        router.push(role === "admin" ? "/courses/manage" : "/courses");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Demo login failed");
      }
    } catch (err) {
      setError("Demo login failed. Check database connection.");
    } finally {
      setDemoLoading(null);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/courses",
      });
    } catch (err) {
      setError("Google authentication failed");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-1 flex-col lg:flex-row bg-background">
      <div className="absolute top-6 right-6 z-20">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      {/* Left Branding Screen - Gradient Sidebar with Quotes */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 p-12 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-800/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Header Logo */}
        <div className="flex items-center gap-2 z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-200 to-teal-400 bg-clip-text text-transparent">
            Soft Skills Mastery
          </span>
        </div>

        {/* Dynamic Carousel Quotes */}
        <div className="my-auto z-10 max-w-lg transition-all duration-700">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-400 mb-6 uppercase tracking-wider">
            {quotes[quoteIndex].tag}
          </div>
          <p className="text-3xl font-light leading-relaxed mb-6 italic text-slate-100">
            "{quotes[quoteIndex].text}"
          </p>
          <p className="text-sm font-semibold text-slate-400">
            — {quotes[quoteIndex].author}
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-teal-500/60 z-10">
          &copy; {new Date().getFullYear()} Soft Skills Mastery. Powered by Agentic AI.
        </div>
      </div>

      {/* Right Login Form Screen */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo on Mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">Soft Skills Mastery</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New to the platform?{" "}
            <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
              Create an account
            </Link>
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full flex h-11 items-center justify-center gap-2">
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex h-11 items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </div>

          {/* Quick-Access Demo Login Buttons */}
          <div className="mt-8 rounded-2xl bg-teal-500/5 border border-teal-500/10 p-6">
            <h3 className="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-3">
              One-Click Demo Access
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Bypass password entry and log in instantly with configured mock roles.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                id="demo-learner-login"
                disabled={!!demoLoading}
                onClick={() => handleDemoLogin("user")}
                className="flex items-center gap-1.5 h-10 border-teal-500/20 hover:border-teal-500 hover:bg-teal-500/10 hover:text-teal-600 transition-all font-medium text-xs rounded-xl"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {demoLoading === "user" ? "Loading..." : "Demo Learner"}
              </Button>
              <Button
                variant="outline"
                type="button"
                id="demo-admin-login"
                disabled={!!demoLoading}
                onClick={() => handleDemoLogin("admin")}
                className="flex items-center gap-1.5 h-10 border-teal-500/20 hover:border-teal-500 hover:bg-teal-500/10 hover:text-teal-600 transition-all font-medium text-xs rounded-xl"
              >
                <Shield className="h-3.5 w-3.5" />
                {demoLoading === "admin" ? "Loading..." : "Demo Admin"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
