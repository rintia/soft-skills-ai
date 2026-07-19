import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

// GET: Retrieve user's enrollments with course details
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const getAll = searchParams.get("all") === "true";

    const client = await clientPromise;
    const db = client.db("softskills");

    // Check role to determine if admin
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

    const isAdmin = role === "admin" || session.user.email === "admin@example.com";

    // Build query based on role and parameters
    const query = (getAll && isAdmin) ? {} : { userId: session.user.id };
    
    // Find all enrollments
    const enrollments = await db
      .collection("enrollments")
      .find(query)
      .toArray();

    if (enrollments.length === 0) {
      return NextResponse.json([]);
    }

    // Retrieve course details for all enrolled courses
    const courseIds = enrollments.map((e: any) => e.courseId);
    
    const objectIdCourseIds = courseIds
      .filter((id: string) => ObjectId.isValid(id))
      .map((id: string) => new ObjectId(id));

    const courses = await db
      .collection("courses")
      .find({ 
        $or: [
          { _id: { $in: courseIds } },
          { id: { $in: courseIds } },
          ...(objectIdCourseIds.length > 0 ? [{ _id: { $in: objectIdCourseIds } }] : [])
        ]
      })
      .toArray();


    // Map course details onto enrollments
    const enrolledCourses = enrollments.map((enrollment: any) => {
      const course = courses.find((c: any) => String(c._id) === String(enrollment.courseId) || String(c.id) === String(enrollment.courseId));
      return {
        ...enrollment,
        course
      };
    });

    return NextResponse.json(enrolledCourses);
  } catch (error: any) {
    console.error("GET Enrollments Error:", error);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

// POST: Enroll in a course (Mock payment)
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("softskills");

    // Check if course exists
    let queryCourseId: string | ObjectId = courseId;
    try {
      if (ObjectId.isValid(courseId)) {
        queryCourseId = new ObjectId(courseId);
      }
    } catch (e) {}

    const course = await db.collection("courses").findOne({
      $or: [{ _id: courseId }, { id: courseId }, { _id: queryCourseId }]
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if user is already enrolled
    const targetCourseId = String(course._id || course.id);
    const existingEnrollment = await db.collection("enrollments").findOne({
      userId: session.user.id,
      courseId: targetCourseId
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 400 });
    }

    const newEnrollment = {
      userId: session.user.id,
      courseId: targetCourseId,
      amountPaid: course.price,
      enrolledAt: new Date(),
    };

    const result = await db.collection("enrollments").insertOne(newEnrollment);

    return NextResponse.json({ 
      message: "Enrolled successfully", 
      enrollmentId: result.insertedId 
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Enrollment Error:", error);
    return NextResponse.json({ error: "Failed to complete enrollment" }, { status: 500 });
  }
}
