import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

// POST: Add review for a course
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (rating === undefined || !comment || comment.trim() === "") {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 });
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

    const course = await collection.findOne({
      $or: [{ _id: id }, { id: id }, { _id: queryId }]
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const newReview = {
      userId: session.user.id,
      userName: session.user.name || session.user.email.split("@")[0],
      rating: ratingNum,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    const reviews = course.reviews || [];
    reviews.push(newReview);

    // Calculate new average rating
    const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

    const targetId = course._id || course.id;

    await collection.updateOne(
      { $or: [{ _id: targetId }, { id: String(targetId) }] },
      { 
        $set: { 
          reviews,
          rating: averageRating
        } 
      }
    );

    return NextResponse.json({ 
      message: "Review added successfully", 
      review: newReview,
      averageRating 
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}
