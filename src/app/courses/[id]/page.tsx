"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/toast";
import { 
  Star, 
  Clock, 
  Layers, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  Loader2, 
  CheckCircle2, 
  ShieldAlert, 
  MessageSquare,
  ArrowLeft,
  X
} from "lucide-react";

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { toast } = useToast();

  // Local state
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  // 1. Fetch current course details
  const { data: course, isLoading: courseLoading, isError: courseError } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${id}`);
      if (!res.ok) throw new Error("Course not found");
      return res.json();
    }
  });

  // 2. Fetch user enrollments (only if logged in)
  const { data: enrollments = [] } = useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const res = await fetch("/api/enroll");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!session?.user
  });

  // 3. Fetch related courses (same category, limit 4)
  const { data: relatedData } = useQuery({
    queryKey: ["related-courses", course?.category],
    queryFn: async () => {
      const res = await fetch(`/api/courses?category=${encodeURIComponent(course?.category)}&limit=5`);
      if (!res.ok) return { courses: [] };
      return res.json();
    },
    enabled: !!course?.category
  });

  const relatedCourses = (relatedData?.courses || [])
    .filter((c: any) => String(c._id || c.id) !== String(id))
    .slice(0, 4);

  const isEnrolled = enrollments.some((e: any) => String(e.courseId) === String(id));

  // 4. Enroll Mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to enroll");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
      setPaymentLoading(false);
      setPaymentSuccess(true);
      toast("Successfully enrolled in this course!", "success");
    },
    onError: (err: any) => {
      setPaymentLoading(false);
      alert(err.message || "Enrollment failed. Please try again.");
    }
  });

  // 5. Submit Review Mutation
  const reviewMutation = useMutation({
    mutationFn: async (reviewPayload: { rating: number; comment: string }) => {
      const res = await fetch(`/api/courses/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      setReviewComment("");
      setReviewRating(5);
      setReviewError("");
    },
    onError: (err: any) => {
      setReviewError(err.message || "Failed to add review.");
    }
  });

  const handleEnrollClick = () => {
    if (!session?.user) {
      router.push("/login");
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc) {
      alert("Please fill out all card fields.");
      return;
    }
    setPaymentLoading(true);
    // Simulate transaction delay
    setTimeout(() => {
      enrollMutation.mutate();
    }, 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    if (!reviewComment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }
    reviewMutation.mutate({ rating: reviewRating, comment: reviewComment });
  };

  if (courseLoading) {
    return (
      <PageLayout>
        <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-xl w-1/3 mx-auto" />
          <div className="h-[400px] bg-muted rounded-3xl w-full" />
        </div>
      </PageLayout>
    );
  }

  if (courseError || !course) {
    return (
      <PageLayout>
        <div className="mx-auto w-full max-w-lg px-4 py-20 text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold">Course Not Found</h3>
          <p className="text-muted-foreground text-sm">
            We couldn't retrieve details for this course. It may have been deleted or the ID is invalid.
          </p>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Button */}
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Listing
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Text details */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1 bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {course.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
              {course.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {course.shortDescription}
            </p>

            {/* Spec badges */}
            <div className="grid grid-cols-3 gap-4 border-y border-border py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-teal-600" />
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Duration</span>
                  <span className="text-xs font-bold text-foreground">{course.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-teal-600" />
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Level</span>
                  <span className="text-xs font-bold text-foreground">{course.level}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-teal-600" />
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Modules</span>
                  <span className="text-xs font-bold text-foreground">{course.modules?.length || 0} Modules</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg">{course.rating || 4.8}</span>
                <span className="text-xs text-muted-foreground">({course.reviews?.length || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Card / Image */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg p-6 space-y-6">
              <div className="h-52 bg-slate-100 rounded-2xl overflow-hidden relative border border-border">
                <img 
                  src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground font-semibold">Registration Fee</span>
                <span className="text-3xl font-extrabold text-foreground">${course.price}</span>
              </div>
              {isEnrolled ? (
                <Link href="/my-courses" className="block w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl text-teal-600 border-teal-600 bg-teal-500/5 hover:bg-teal-500/10 font-bold">
                    Enrolled (Go to My Courses)
                  </Button>
                </Link>
              ) : (
                <Button onClick={handleEnrollClick} id="enroll-course-button" className="w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <CreditCard className="h-4.5 w-4.5" />
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Description & Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pt-8 border-t border-border">
          {/* Main Description */}
          <div className="lg:col-span-7 space-y-8">
            <div className="prose prose-teal max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Course Description</h2>
              <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {course.fullDescription}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Learner Reviews</h2>
              
              {/* Review Input */}
              {isEnrolled ? (
                <form onSubmit={handleReviewSubmit} className="bg-muted p-5 rounded-2xl border border-border space-y-4">
                  <h3 className="text-sm font-bold text-foreground">Write a Review</h3>
                  
                  {reviewError && <p className="text-xs text-red-500 font-medium">{reviewError}</p>}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">Your Rating:</span>
                    <div className="flex gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star className={`h-5 w-5 ${star <= reviewRating ? "fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Share your thoughts about this course..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="bg-background text-xs h-10 px-3"
                    />
                    <Button type="submit" disabled={reviewMutation.isPending} className="h-10 text-xs px-5">
                      {reviewMutation.isPending ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-500/5 border border-border p-4 rounded-xl text-xs text-muted-foreground">
                  You must be enrolled in this course to leave a review.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {course.reviews && course.reviews.length > 0 ? (
                  course.reviews.map((rev: any, idx: number) => (
                    <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-foreground">{rev.userName}</span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No reviews yet. Be the first to share your experience!</p>
                )}
              </div>
            </div>
          </div>

          {/* Syllabus Modules */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Syllabus Outline</h2>
            <div className="space-y-3">
              {course.modules && course.modules.map((mod: string, idx: number) => {
                const isActive = activeModuleIndex === idx;
                return (
                  <div key={idx} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setActiveModuleIndex(isActive ? null : idx)}
                      className="w-full flex justify-between items-center p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-left transition-colors"
                    >
                      <span className="text-xs font-bold text-foreground">
                        Module {idx + 1}: {mod}
                      </span>
                      {isActive ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {isActive && (
                      <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground border-t border-border/50 bg-slate-50/20 leading-relaxed">
                        This module covers core concepts, practical scenarios, and structured exercises to master this step. Complete interactive assignments to pass this block.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Related courses */}
        {relatedCourses.length > 0 && (
          <div className="pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCourses.map((c: any) => (
                <div key={c._id || c.id} className="group bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <div className="h-32 bg-slate-100 overflow-hidden relative">
                    <img 
                      src={c.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} 
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-teal-500 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                      {c.category}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{c.rating || 4.8}</span>
                    </div>
                    <h3 className="text-xs font-bold text-foreground line-clamp-1 mb-2 group-hover:text-teal-600 transition-colors">
                      {c.title}
                    </h3>
                    <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-extrabold text-foreground">
                        ${c.price}
                      </span>
                      <Link href={`/courses/${c.id || c._id}`}>
                        <Button size="sm" variant="ghost" className="text-[10px] h-8 px-2.5">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mock Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border p-6 rounded-3xl shadow-2xl space-y-6 mx-4 transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-teal-600" />
                Checkout Verification
              </h3>
              <button 
                onClick={() => {
                  if (!paymentLoading) {
                    setShowPaymentModal(false);
                    setPaymentSuccess(false);
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {paymentSuccess ? (
              /* Success View */
              <div className="py-6 text-center space-y-4 animate-fade-in">
                <CheckCircle2 className="h-16 w-16 text-teal-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-extrabold text-foreground">Payment Confirmed!</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  You have successfully enrolled in **{course.title}**. The transaction has been recorded.
                </p>
                <div className="pt-4 flex gap-3">
                  <Button 
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentSuccess(false);
                      router.push("/my-courses");
                      router.refresh();
                    }}
                    className="flex-1 rounded-xl h-11"
                  >
                    Go to My Courses
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentSuccess(false);
                    }}
                    className="flex-1 rounded-xl h-11"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              /* Card Form View */
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="p-4 bg-muted rounded-xl space-y-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Item</span>
                  <h4 className="text-sm font-bold text-foreground truncate">{course.title}</h4>
                  <div className="flex justify-between text-xs pt-2 border-t border-border/50">
                    <span className="text-muted-foreground font-semibold">Price:</span>
                    <span className="font-extrabold text-foreground">${course.price}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Card Number</label>
                    <Input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      required
                      disabled={paymentLoading}
                      className="h-10 text-xs px-3 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Expiry</label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                        required
                        disabled={paymentLoading}
                        className="h-10 text-xs px-3 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">CVC</label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        maxLength={3}
                        required
                        disabled={paymentLoading}
                        className="h-10 text-xs px-3 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={paymentLoading} 
                  className="w-full h-11 mt-4 rounded-xl flex items-center justify-center gap-2 font-bold"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authorizing Transaction...
                    </>
                  ) : (
                    <>
                      Pay ${course.price} & Enroll
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
