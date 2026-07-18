import { NextResponse } from "next/server";
import { generateCourseContent } from "@/lib/gemini";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import clientPromise from "@/lib/db";

// Helper to check admin access
async function getSessionAndRole() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return { session: null, isAdmin: false };
  
  const client = await clientPromise;
  const db = client.db("softskills");
  const userDoc = await db.collection("user").findOne({ 
    $or: [{ _id: session.user.id }, { id: session.user.id }]
  });
  const role = userDoc?.role || (session.user as any).role || "user";
  
  return { session, isAdmin: role === "admin" };
}

export async function POST(request: Request) {
  try {
    const { isAdmin } = await getSessionAndRole();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const { title, category } = body;

    if (!title || !category) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    const courseContent = await generateCourseContent(title, category);
    return NextResponse.json(courseContent);
  } catch (error: any) {
    console.error("API AI Generate Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
