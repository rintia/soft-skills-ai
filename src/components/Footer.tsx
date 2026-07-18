"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full border-t border-border bg-slate-50 dark:bg-slate-950/60 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-md font-bold tracking-tight text-foreground">
                Soft Skills Mastery
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Empowering professionals worldwide to excel in communication, empathy, negotiation, and modern workplace leadership through high-fidelity, Agentic AI guided training.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/courses" className="hover:text-teal-600 transition-colors">Explore Courses</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-600 transition-colors">Our Mission</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-600 transition-colors">Support & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Weekly Insights</h4>
            <p className="text-xs text-muted-foreground leading-normal">
              Subscribe to get actionable soft skills growth tips and platform release details directly.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
              <Input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 px-3 rounded-lg text-xs"
              />
              <Button type="submit" size="sm" className="h-9 w-9 rounded-lg p-0 flex items-center justify-center">
                {subscribed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <div>
            &copy; {new Date().getFullYear()} Soft Skills Mastery. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-teal-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
