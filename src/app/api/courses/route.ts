import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Helper to check admin access
async function getSessionAndRole() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return { session: null, isAdmin: false };
  
  const client = await clientPromise;
  const db = client.db("softskills");
  
  // Try finding user role directly in user collection
  const userDoc = await db.collection("user").findOne({ 
    $or: [{ _id: session.user.id }, { id: session.user.id }]
  });
  const role = userDoc?.role || (session.user as any).role || "user";
  
  return { 
    session, 
    isAdmin: role === "admin", 
    role, 
    userId: session.user.id 
  };
}

// GET: List courses with search, filters, sorting, and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const priceMin = parseFloat(searchParams.get("priceMin") || "0");
    const priceMax = parseFloat(searchParams.get("priceMax") || "999999");
    const ratingMin = parseFloat(searchParams.get("ratingMin") || "0");
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("softskills");
    const collection = db.collection("courses");

    // Build filter query
    const filterQuery: any = {};

    if (search) {
      filterQuery.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filterQuery.category = category;
    }
    if (priceMin > 0 || priceMax < 999999) {
      filterQuery.price = { $gte: priceMin, $lte: priceMax };
    }
    if (ratingMin > 0) {
      filterQuery.rating = { $gte: ratingMin };
    }

    // Build sort query
    let sortQuery: any = {};
    if (sortBy === "price_asc") {
      sortQuery.price = 1;
    } else if (sortBy === "price_desc") {
      sortQuery.price = -1;
    } else if (sortBy === "rating_desc") {
      sortQuery.rating = -1;
    } else {
      sortQuery.createdAt = -1; // newest
    }

    // Query data
    const total = await collection.countDocuments(filterQuery);
    const courses = await collection
      .find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("GET Courses Error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

// POST: Add new course (Admin only)
export async function POST(request: Request) {
  try {
    const { isAdmin } = await getSessionAndRole();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { title, shortDescription, fullDescription, price, category, imageUrl, duration, level, modules } = body;

    // Validation
    if (!title || !shortDescription || !fullDescription || price === undefined || !category || !imageUrl || !duration || !level || !modules) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("softskills");
    const collection = db.collection("courses");

    const newCourse = {
      title,
      shortDescription,
      fullDescription,
      price: parseFloat(price),
      rating: 5.0, // initial default rating
      category,
      imageUrl,
      duration,
      level,
      modules: Array.isArray(modules) ? modules : [modules],
      reviews: [],
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newCourse);

    return NextResponse.json({ 
      message: "Course created successfully", 
      courseId: result.insertedId 
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Course Error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
