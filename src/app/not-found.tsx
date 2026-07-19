"use client";

import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowRight, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center flex-1 flex flex-col justify-center items-center">
        {/* Animated Glow Icon */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-2xl">
          <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-ping opacity-75" />
          <Compass className="h-12 w-12 animate-spin-slow text-teal-500" style={{ animationDuration: "10s" }} />
        </div>

        {/* 404 Title */}
        <h1 className="text-8xl font-black tracking-tighter bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-md select-none animate-pulse">
          404
        </h1>
        
        {/* Soft Skills Theme Message */}
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Syllabus Deviation Detected
        </h2>
        
        <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
          It looks like you've wandered off the structured learning path. Don't worry—even the most emotionally intelligent leaders take unexpected detours. Let's redirect you back to safety.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button className="w-full h-12 px-6 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-teal-500/20">
              Browse Course Catalog
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-12 px-6 rounded-xl flex items-center justify-center gap-2 font-semibold">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
