"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Loader2, 
  Check, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function AddCoursePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Communication");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800");
  const [duration, setDuration] = useState("8 Hours");
  const [level, setLevel] = useState("Intermediate");
  const [modules, setModules] = useState<string[]>([""]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // AI loading and status states
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Check role
  const user = session?.user;
  const isAdmin = (user as any)?.role === "admin" || user?.email === "admin@example.com";

  // AI Content Generation Mutation
  const generateAiMutation = useMutation({
    mutationFn: async (payload: { title: string; category: string }) => {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate content");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.shortDescription) setShortDescription(data.shortDescription);
      if (data.fullDescription) setFullDescription(data.fullDescription);
      if (data.modules && Array.isArray(data.modules)) setModules(data.modules);
      if (data.seoMetaTags) {
        setSeoTitle(data.seoMetaTags.title || "");
        setSeoDescription(data.seoMetaTags.description || "");
      }
      setAiGenerating(false);
      setAiSuccess(true);
      setTimeout(() => setAiSuccess(false), 3000);
    },
    onError: (err: any) => {
      setAiGenerating(false);
      alert(err.message || "AI Generation failed. Check API key configurations.");
    }
  });

  // Course Add Mutation
  const addCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create course");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      router.push("/courses/manage");
      router.refresh();
    },
    onError: (err: any) => {
      setSubmitError(err.message || "Failed to create course. Please review field inputs.");
    }
  });

  const handleAiGenerate = () => {
    if (!title) {
      alert("Please provide a course title first to guide the AI generator.");
      return;
    }
    setAiGenerating(true);
    generateAiMutation.mutate({ title, category });
  };

  const handleAddModule = () => {
    setModules([...modules, ""]);
  };

  const handleModuleChange = (index: number, val: string) => {
    const updated = [...modules];
    updated[index] = val;
    setModules(updated);
  };

  const handleRemoveModule = (index: number) => {
    if (modules.length === 1) return;
    const updated = modules.filter((_, i) => i !== index);
    setModules(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const validModules = modules.filter(m => m.trim() !== "");
    if (validModules.length === 0) {
      setSubmitError("You must provide at least one syllabus module.");
      return;
    }

    const payload = {
      title,
      shortDescription,
      fullDescription,
      price: parseFloat(price),
      category,
      imageUrl,
      duration,
      level,
      modules: validModules,
    };

    addCourseMutation.mutate(payload);
  };

  if (sessionPending) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </PageLayout>
    );
  }

  // Guard: Access Denied
  if (!user || !isAdmin) {
    return (
      <PageLayout>
        <div className="mx-auto w-full max-w-md px-4 py-20 text-center space-y-6">
          <ShieldAlert className="h-14 w-14 text-red-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Access Denied</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This dashboard is restricted to administrator accounts.
          </p>
          <Link href="/courses">
            <Button>Return to Explore</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const categories = [
    "Communication",
    "Leadership",
    "Emotional Intelligence",
    "Productivity",
    "Critical Thinking"
  ];

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Back Link */}
        <Link href="/courses/manage" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Create New Course</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Add a new course to the soft skills catalog manually or co-create with Gemini AI.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={aiGenerating}
            onClick={handleAiGenerate}
            className="flex items-center gap-1.5 border-teal-500/20 text-teal-600 hover:bg-teal-500/10 rounded-xl"
          >
            {aiGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : aiSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                AI Generated!
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </>
            )}
          </Button>
        </div>

        {submitError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-600 dark:text-red-400">
            {submitError}
          </div>
        )}

        {/* Form Details */}
        <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Course Title</label>
              <Input
                type="text"
                required
                placeholder="e.g. Active Listening for Managers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-xs px-3 rounded-lg"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Price ($)</label>
              <Input
                type="number"
                required
                step="0.01"
                placeholder="e.g. 49.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-10 text-xs px-3 rounded-lg"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Image URL</label>
              <Input
                type="text"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-10 text-xs px-3 rounded-lg"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Duration</label>
              <Input
                type="text"
                required
                placeholder="e.g. 8 Hours"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-10 text-xs px-3 rounded-lg"
              />
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Skill Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">Short Description</label>
            <Input
              type="text"
              required
              placeholder="Concisely describe this course hook..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="h-10 text-xs px-3 rounded-lg"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">Full Description (Markdown)</label>
            <textarea
              required
              rows={6}
              placeholder="Provide a rich structured overview of what learners will study..."
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Dynamic Syllabus Modules */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-foreground">Syllabus Outline Modules</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddModule}
                className="text-xs h-8 px-3 rounded-lg flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Module
              </Button>
            </div>
            
            <div className="space-y-2">
              {modules.map((mod, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    required
                    placeholder={`Module ${index + 1} Name`}
                    value={mod}
                    onChange={(e) => handleModuleChange(index, e.target.value)}
                    className="h-9 text-xs px-3 rounded-lg flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={modules.length === 1}
                    onClick={() => handleRemoveModule(index)}
                    className="h-9 w-9 rounded-lg border-red-500/20 text-red-500 hover:bg-red-500/5 hover:border-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Details */}
          <div className="border-t border-border pt-6 space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">SEO Meta Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">SEO Title Tag</label>
                <Input
                  type="text"
                  placeholder="e.g. Active Listening Course"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="h-9 text-xs px-3 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">SEO Meta Description</label>
                <Input
                  type="text"
                  placeholder="Short description under 160 characters..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="h-9 text-xs px-3 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Link href="/courses/manage">
              <Button type="button" variant="outline" className="rounded-xl h-11 px-6">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={addCourseMutation.isPending} className="rounded-xl h-11 px-6 font-bold">
              {addCourseMutation.isPending ? "Saving..." : "Create Course"}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
