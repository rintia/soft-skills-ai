"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Star, Search, Filter, SlidersHorizontal, BookOpen, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Local state for filters, initialized from URL search params if present
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [ratingMin, setRatingMin] = useState(searchParams.get("ratingMin") || "0");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "100");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  // Sync state if URL changes (e.g., category selection from Home page)
  useEffect(() => {
    const catParam = searchParams.get("category") || "";
    setCategory(catParam);
    const searchParam = searchParams.get("search") || "";
    setSearch(searchParam);
  }, [searchParams]);

  // Build API query URL
  const queryParams = new URLSearchParams({
    search,
    category,
    ratingMin,
    priceMax,
    sortBy,
    page: String(page),
    limit: "6",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["courses", search, category, ratingMin, priceMax, sortBy, page],
    queryFn: async () => {
      const res = await fetch(`/api/courses?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
  });

  const courses = data?.courses || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 6, totalPages: 1 };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setRatingMin("0");
    setPriceMax("100");
    setSortBy("newest");
    setPage(1);
    router.push("/courses");
  };

  const categories = [
    "Communication",
    "Leadership",
    "Emotional Intelligence",
    "Productivity",
    "Critical Thinking"
  ];

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Explore Courses</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enhance your interpersonal communication, critical reasoning, and team-building capabilities.
          </p>
        </div>

        {/* Search bar & Grid Control (Mobile Filter toggle placeholder) */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              type="text"
              id="course-search-bar"
              placeholder="Search courses by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
            </select>
            <Button variant="outline" onClick={handleResetFilters} className="h-11 rounded-xl">
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Left Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6 bg-card border border-border rounded-2xl p-6 h-fit shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                <SlidersHorizontal className="h-4 w-4 text-teal-600" />
                Filter Options
              </span>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Max Filter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-foreground uppercase tracking-wider">
                <span>Max Price</span>
                <span className="text-teal-600">${priceMax}</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={priceMax}
                onChange={(e) => {
                  setPriceMax(e.target.value);
                  setPage(1);
                }}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>$10</span>
                <span>$150</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Minimum Rating</label>
              <div className="space-y-2">
                {[
                  { value: "0", label: "Any Rating" },
                  { value: "4.5", label: "4.5★ & Above" },
                  { value: "4.8", label: "4.8★ & Above" }
                ].map((r) => (
                  <label key={r.value} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={r.value}
                      checked={ratingMin === r.value}
                      onChange={(e) => {
                        setRatingMin(e.target.value);
                        setPage(1);
                      }}
                      className="accent-teal-600"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Courses Grid */}
          <div className="flex-1 flex flex-col justify-between">
            {isLoading ? (
              /* Skeleton Grid while loading */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-[360px] animate-pulse bg-muted rounded-2xl border border-border" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <p className="text-red-500 font-medium">Failed to load courses from database.</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm mb-8 my-auto">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground">No Courses Found</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  We couldn't find any courses matching your current search queries. Try resetting the filters or modifying your search terms.
                </p>
                <Button onClick={handleResetFilters} className="mt-6">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              /* Real Courses Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {courses.map((course: any) => (
                  <div
                    key={course._id || course.id}
                    className="group bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                      <img
                        src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        {course.category}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-2">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{course.rating || 4.8}</span>
                        <span className="text-muted-foreground text-[10px]">({course.reviews?.length || 0})</span>
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

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-border mt-auto">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    onClick={() => setPage(p)}
                    className="rounded-lg h-9 w-9 text-xs"
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Loading explore catalog...</p>
        </div>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}
