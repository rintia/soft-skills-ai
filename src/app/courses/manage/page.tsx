"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart2, 
  BookOpen, 
  Users, 
  DollarSign, 
  ShieldAlert,
  Loader2,
  Trash
} from "lucide-react";

export default function ManageCoursesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { toast } = useToast();

  // Local state for delete confirmation dialog
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 1. Fetch all courses (limit 100 for admin overview)
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses?limit=100");
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
    enabled: !!session?.user
  });

  // 2. Fetch all enrollments in database (admin access required)
  const { data: allEnrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["admin-all-enrollments"],
    queryFn: async () => {
      const res = await fetch("/api/enroll?all=true");
      if (!res.ok) throw new Error("Failed to fetch enrollments");
      return res.json();
    },
    enabled: !!session?.user
  });

  const courses = coursesData?.courses || [];

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete course");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast("Course deleted successfully!", "success");
      setCourseToDelete(null);
      setDeleteLoading(false);
    },
    onError: (err: any) => {
      setDeleteLoading(false);
      alert(err.message || "Failed to delete course. Please try again.");
    }
  });

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      setDeleteLoading(true);
      deleteMutation.mutate(courseToDelete.id);
    }
  };

  // Auth checking
  const user = session?.user;
  const isAdmin = (user as any)?.role === "admin" || user?.email === "admin@example.com";

  if (sessionPending) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <span className="text-sm text-muted-foreground">Verifying access credentials...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Guard: Unauthorized
  if (!user || !isAdmin) {
    return (
      <PageLayout>
        <div className="mx-auto w-full max-w-md px-4 py-20 text-center space-y-6">
          <ShieldAlert className="h-14 w-14 text-red-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Access Denied</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This dashboard is restricted to administrator accounts. Please sign in with an administrator role to manage courses.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button className="h-11 px-6 rounded-xl">Sign In as Admin</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="h-11 px-6 rounded-xl">Return to Explore</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Calculate platform stats
  const totalCoursesCount = courses.length;
  const totalStudentsCount = allEnrollments.length;
  const totalRevenue = allEnrollments.reduce((sum: number, e: any) => sum + (e.amountPaid || 0), 0);

  // Group enrollments per course category for chart
  const categoryStats = courses.reduce((acc: any, course: any) => {
    const cat = course.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = 0;
    const count = allEnrollments.filter((e: any) => String(e.courseId) === String(course._id || course.id)).length;
    acc[cat] += count;
    return acc;
  }, {});

  const chartData = Object.keys(categoryStats).map(key => ({
    name: key,
    enrollments: categoryStats[key]
  }));

  const COLORS = ["#0d9488", "#0f766e", "#14b8a6", "#2dd4bf", "#5eead4"];

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Catalog Manager</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review platform statistics, enrollments, and update course offerings.
            </p>
          </div>
          <Link href="/courses/manage/add">
            <Button className="h-11 px-5 rounded-xl flex items-center gap-2 font-bold shadow-md">
              <Plus className="h-4.5 w-4.5" />
              Add New Course
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Total Courses</span>
              <span className="text-xl font-extrabold text-foreground">{totalCoursesCount}</span>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center flex-shrink-0">
              <Users className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Total Enrollments</span>
              <span className="text-xl font-extrabold text-foreground">{totalStudentsCount}</span>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Platform Revenue</span>
              <span className="text-xl font-extrabold text-foreground">${totalRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Grid: Course Table + Recharts Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Course Table */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-foreground">Course Catalog</h3>
            </div>
            
            {coursesLoading ? (
              <div className="p-8 text-center animate-pulse space-y-4">
                <div className="h-10 bg-muted rounded-lg" />
                <div className="h-10 bg-muted rounded-lg" />
                <div className="h-10 bg-muted rounded-lg" />
              </div>
            ) : courses.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm italic">
                No courses currently seeded in database. Click Add Course to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course: any) => (
                      <tr key={course._id || course.id} className="border-b border-border/60 hover:bg-slate-500/5 transition-colors">
                        <td className="p-4 font-bold text-foreground truncate max-w-[200px]" title={course.title}>
                          {course.title}
                        </td>
                        <td className="p-4">
                          <span className="bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded-full font-semibold">
                            {course.category}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-foreground">${course.price}</td>
                        <td className="p-4 font-medium text-foreground">{course.rating || 5.0}★</td>
                        <td className="p-4 text-right flex justify-end gap-1.5">
                          <Link href={`/courses/${course.id || course._id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-teal-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/courses/manage/edit/${course.id || course._id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-amber-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => setCourseToDelete({ id: String(course._id || course.id), title: course.title })}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Visual Stats Chart */}
          <div className="lg:col-span-4 bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <BarChart2 className="h-5 w-5 text-teal-600" />
              Enrollments per Category
            </h3>
            
            <div className="h-64 w-full">
              {enrollmentsLoading || coursesLoading ? (
                <div className="h-full w-full bg-muted animate-pulse rounded-xl" />
              ) : chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
                  No chart data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px" }}
                      itemStyle={{ color: "#fff", fontSize: "11px" }}
                      labelStyle={{ color: "#2dd4bf", fontSize: "10px", fontWeight: "bold" }}
                    />
                    <Bar dataKey="enrollments" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border p-6 rounded-3xl shadow-2xl space-y-4 mx-4">
            <h3 className="text-md font-bold text-foreground">Confirm Deletion</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Are you sure you want to permanently delete course **{courseToDelete.title}** from the catalog? This action is irreversible.
            </p>
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                disabled={deleteLoading}
                onClick={() => setCourseToDelete(null)}
                className="flex-1 rounded-xl h-10 text-xs"
              >
                Cancel
              </Button>
              <Button 
                disabled={deleteLoading}
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl h-10 text-xs flex items-center justify-center gap-1.5"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="h-3.5 w-3.5" />
                    Delete Course
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
