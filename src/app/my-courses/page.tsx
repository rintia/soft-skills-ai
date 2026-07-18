"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { BookOpen, Star, Sparkles, Play, ShieldAlert, Award } from "lucide-react";

export default function MyCoursesPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Query enrolled courses
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: async () => {
      const res = await fetch("/api/enroll");
      if (!res.ok) throw new Error("Failed to fetch enrollments");
      return res.json();
    },
    enabled: !!session?.user
  });

  if (sessionPending || (session?.user && enrollmentsLoading)) {
    return (
      <PageLayout>
        <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-xl w-1/4 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-60 bg-muted rounded-2xl border border-border" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  // Not logged in
  if (!session?.user) {
    return (
      <PageLayout>
        <div className="mx-auto w-full max-w-md px-4 py-20 text-center space-y-6">
          <div className="h-16 w-16 bg-teal-500/10 text-teal-600 rounded-full flex items-center justify-center mx-auto border border-teal-500/20">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Sign In to View Enrolled Courses</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Track your progress, access modules, write reviews, and receive certifications by signing in with your account.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button className="h-11 px-6 rounded-xl">Sign In Now</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="h-11 px-6 rounded-xl">Register</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Courses</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your ongoing soft skills progress and continue where you left off.
          </p>
        </div>

        {enrollments.length === 0 ? (
          /* Empty Enrollments */
          <div className="bg-card border border-border rounded-3xl p-16 text-center shadow-sm my-auto max-w-2xl mx-auto">
            <Sparkles className="h-12 w-12 text-teal-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-foreground">No Enrolled Courses</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              You haven't enrolled in any soft skills courses yet. Start your development journey by exploring our available catalog.
            </p>
            <Link href="/courses">
              <Button className="mt-6 h-11 px-6 rounded-xl">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          /* Enrolled Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: any) => {
              const { course, enrolledAt } = enrollment;
              if (!course) return null;
              
              // Simple mock progress values for display
              const mockProgress = course.id === "course-1" ? 45 : course.id === "course-3" ? 80 : 0;
              const formattedDate = new Date(enrolledAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric"
              });

              return (
                <div key={enrollment._id || enrollment.id} className="group bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300">
                  <div className="h-32 bg-slate-100 overflow-hidden relative">
                    <img 
                      src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-teal-500 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground line-clamp-1 mb-1 group-hover:text-teal-600 transition-colors">
                        {course.title}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Enrolled on {formattedDate}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-foreground">
                        <span>Course Progress</span>
                        <span className="text-teal-600">{mockProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${mockProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{course.rating || 4.8}</span>
                      </div>
                      <Link href={`/courses/${course.id || course._id}`}>
                        <Button size="sm" className="h-9 text-xs gap-1 px-4 rounded-lg">
                          <Play className="h-3 w-3 fill-current" />
                          Resume
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
