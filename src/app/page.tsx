"use client";

import React from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  MessageSquare, 
  Users, 
  BookOpen, 
  Award, 
  Star, 
  Layers,
  HeartHandshake,
  Clock,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  // Fetch popular courses (limit 4)
  const { data, isLoading } = useQuery({
    queryKey: ["popular-courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses?limit=4");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const popularCourses = data?.courses || [];

  const categories = [
    { name: "Communication", icon: MessageSquare, desc: "Public speaking, body language, and structuring content.", count: 12 },
    { name: "Leadership", icon: Shield, desc: "Empathetic leadership, team cohesion, and coaching.", count: 8 },
    { name: "Emotional Intelligence", icon: HeartHandshake, desc: "Self-awareness, triggers, and relationship building.", count: 10 },
    { name: "Productivity", icon: Clock, desc: "Time blocking, procrastination strategies, and deep focus.", count: 7 }
  ];

  return (
    <PageLayout>
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-teal-500/5 via-transparent to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <Sparkles className="h-3.5 w-3.5" />
            Empowering Your Professional Journey
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-[1.15]">
            Master the Art of{" "}
            <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              Soft Skills
            </span>{" "}
            with Agentic AI
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Elevate your career with courses in leadership, high-impact communication, negotiation, and emotional intelligence—guided by personal AI learning mentors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 flex items-center gap-2 rounded-xl">
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Why Learn With Us?
            </h2>
            <p className="mt-4 text-muted-foreground">
              We integrate state-of-the-art AI assistants to customize your development path and accelerate skill internalization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI-Guided Learning</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interact with our catalog-aware chatbot to receive hyper-focused soft skill insights and course recommendations.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Expert-Curated Syllabus</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our modules are structured with actionable worksheets, step-by-step roleplay models, and professional checklists.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Career Credentials</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Demonstrate your capabilities in communication, empathy, and logic with certified digital completions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Courses Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Popular Courses
              </h2>
              <p className="mt-2 text-muted-foreground">
                Our top-enrolled classes led by seasoned industry experts.
              </p>
            </div>
            <Link href="/courses" className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 mt-4 sm:mt-0 hover:underline">
              View All Courses
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-[340px] animate-pulse bg-muted rounded-2xl border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCourses.map((course: any) => (
                <div key={course._id || course.id} className="group bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <div className="h-40 bg-slate-100 overflow-hidden relative">
                    <img 
                      src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                      {course.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-2">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{course.rating || 4.8}</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 mb-2 group-hover:text-teal-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {course.shortDescription}
                    </p>
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-extrabold text-foreground">
                        ${course.price}
                      </span>
                      <Link href={`/courses/${course.id || course._id}`}>
                        <Button size="sm" variant="ghost" className="text-xs gap-1">
                          Details
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. AI Assistant Teaser */}
      <section className="py-16 bg-teal-950 text-white relative overflow-hidden rounded-3xl max-w-7xl mx-auto my-12 px-6 sm:px-12 lg:px-16 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 px-3 py-1 text-xs font-semibold text-teal-300">
              <Sparkles className="h-3.5 w-3.5" />
              INTELLIGENT AI COPILOT
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Stuck on your career path? Ask our AI Assistant.
            </h2>
            <p className="text-teal-100/80 leading-relaxed text-sm">
              Our floating chatbot learns the details of our complete curriculum. Ask for personal public speaking advice, negotiate salary tactics, or request direct course mapping suggestions.
            </p>
            <div className="pt-2">
              <Link href="/courses">
                <Button variant="outline" className="border-teal-400 text-teal-200 hover:bg-teal-900 bg-transparent rounded-xl flex items-center gap-2">
                  Explore with Assistant
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-teal-900/40 border border-teal-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xs">AI</div>
              <span className="text-xs text-teal-300 font-bold uppercase tracking-wider">Try asking...</span>
            </div>
            <div className="space-y-2">
              <div className="bg-teal-950/50 hover:bg-teal-950/80 border border-teal-500/10 rounded-xl p-3 text-xs text-teal-100 cursor-pointer transition-colors">
                "I struggle with stage fright during presentations. Which course should I take?"
              </div>
              <div className="bg-teal-950/50 hover:bg-teal-950/80 border border-teal-500/10 rounded-xl p-3 text-xs text-teal-100 cursor-pointer transition-colors">
                "Are there any negotiation courses to help with salary talks?"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Categories Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Browse by Category
            </h2>
            <p className="mt-4 text-muted-foreground">
              Target specific communication or organizational skills depending on your personal goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={`/courses?category=${encodeURIComponent(cat.name)}`} className="group">
                  <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-teal-500 hover:shadow-md transition-all flex flex-col h-full">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold mb-1 text-foreground group-hover:text-teal-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-normal mb-4">
                      {cat.desc}
                    </p>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-auto flex items-center gap-0.5">
                      {cat.count} courses
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Statistics Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center bg-card border border-border rounded-3xl p-10 shadow-sm">
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-teal-600 dark:text-teal-400">10k+</div>
              <div className="text-sm font-semibold text-foreground">Enrolled Learners</div>
              <p className="text-xs text-muted-foreground">Building better careers every day.</p>
            </div>
            <div className="space-y-2 border-y sm:border-y-0 sm:border-x border-border py-6 sm:py-0">
              <div className="text-4xl sm:text-5xl font-extrabold text-teal-600 dark:text-teal-400">50+</div>
              <div className="text-sm font-semibold text-foreground">AI Guided Courses</div>
              <p className="text-xs text-muted-foreground">Specialized soft-skill topics.</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-teal-600 dark:text-teal-400">98%</div>
              <div className="text-sm font-semibold text-foreground">Satisfaction Rating</div>
              <p className="text-xs text-muted-foreground">Based on course feedback survey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              What Our Learners Say
            </h2>
            <p className="mt-4 text-muted-foreground">
              Real success stories from professionals who accelerated their promotions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                "The public speaking course helped me deliver my project pitch flawlessly. My vice president commended my clarity and structure."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-teal-500/10 text-teal-600 font-bold flex items-center justify-center text-xs">SJ</div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Sarah Jenkins</h4>
                  <span className="text-[10px] text-muted-foreground">Product Manager</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                "Leading with empathy frameworks were immediately useful. I changed how I do 1-on-1 feedback and trust in my team is noticeably higher."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-teal-500/10 text-teal-600 font-bold flex items-center justify-center text-xs">DK</div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">David Kim</h4>
                  <span className="text-[10px] text-muted-foreground">Engineering Manager</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                "Negotiation frameworks are gold. I was able to prepare my BATNA and negotiate a salary increase of 15% with complete confidence."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-teal-500/10 text-teal-600 font-bold flex items-center justify-center text-xs">MV</div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Marcus Vance</h4>
                  <span className="text-[10px] text-muted-foreground">Consultant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
