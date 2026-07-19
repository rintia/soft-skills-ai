import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

// Helper to check admin access
async function getSessionAndRole() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return { session: null, isAdmin: false };
  
  const client = await clientPromise;
  const db = client.db("softskills");
  
  // Try finding user role directly in user collection using string and ObjectId representation
  let queryId: string | ObjectId = session.user.id;
  try {
    if (ObjectId.isValid(session.user.id)) {
      queryId = new ObjectId(session.user.id);
    }
  } catch (e) {}

  const userDoc = await db.collection("user").findOne({ 
    $or: [{ _id: session.user.id }, { id: session.user.id }, { _id: queryId }]
  });
  const role = userDoc?.role || (session.user as any).role || "user";
  
  return { 
    session, 
    isAdmin: role === "admin", 
    role, 
    userId: session.user.id 
  };
}


// GET: Course details by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("softskills");
    const collection = db.collection("courses");

    let queryId: string | ObjectId = id;
    try {
      if (ObjectId.isValid(id)) {
        queryId = new ObjectId(id);
      }
    } catch (e) {}

    const course = await collection.findOne({
      $or: [{ _id: id }, { id: id }, { _id: queryId }]
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    console.error("GET Course ID Error:", error);
    return NextResponse.json({ error: "Failed to fetch course details" }, { status: 500 });
  }
}

// PUT: Update course (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isAdmin } = await getSessionAndRole();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { title, shortDescription, fullDescription, price, category, imageUrl, duration, level, modules } = body;

    const client = await clientPromise;
    const db = client.db("softskills");
    const collection = db.collection("courses");

    let queryId: string | ObjectId = id;
    try {
      if (ObjectId.isValid(id)) {
        queryId = new ObjectId(id);
      }
    } catch (e) {}

    const existingCourse = await collection.findOne({
      $or: [{ _id: id }, { id: id }, { _id: queryId }]
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const updatedFields: any = {};
    if (title !== undefined) updatedFields.title = title;
    if (shortDescription !== undefined) updatedFields.shortDescription = shortDescription;
    if (fullDescription !== undefined) updatedFields.fullDescription = fullDescription;
    if (price !== undefined) updatedFields.price = parseFloat(price);
    if (category !== undefined) updatedFields.category = category;
    if (imageUrl !== undefined) updatedFields.imageUrl = imageUrl;
    if (duration !== undefined) updatedFields.duration = duration;
    if (level !== undefined) updatedFields.level = level;
    if (modules !== undefined) updatedFields.modules = Array.isArray(modules) ? modules : [modules];

    const targetId = existingCourse._id || existingCourse.id;

    await collection.updateOne(
      { $or: [{ _id: targetId }, { id: String(targetId) }] },
      { $set: updatedFields }
    );

    return NextResponse.json({ message: "Course updated successfully" });
  } catch (error: any) {
    console.error("PUT Course Error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

// DELETE: Delete course (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isAdmin } = await getSessionAndRole();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("softskills");
    const collection = db.collection("courses");

    let queryId: string | ObjectId = id;
    try {
      if (ObjectId.isValid(id)) {
        queryId = new ObjectId(id);
      }
    } catch (e) {}

    const existingCourse = await collection.findOne({
      $or: [{ _id: id }, { id: id }, { _id: queryId }]
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const targetId = existingCourse._id || existingCourse.id;

    await collection.deleteOne({
      $or: [{ _id: targetId }, { id: String(targetId) }]
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Course Error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
