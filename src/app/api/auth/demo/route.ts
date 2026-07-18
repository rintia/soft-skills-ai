import { auth } from "@/lib/auth";
import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { role } = await request.json();
    if (role !== "admin" && role !== "user") {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const email = role === "admin" ? "admin@example.com" : "learner@example.com";
    const name = role === "admin" ? "Demo Admin" : "Demo Learner";
    const password = "Password123!";

    const client = await clientPromise;
    const db = client.db("softskills");

    // 1. Ensure user is created in Better Auth user store
    let user = await db.collection("user").findOne({ email });
    if (!user) {
      try {
        await auth.api.signUpEmail({
          body: {
            email,
            password,
            name,
          },
        });
      } catch (err) {
        console.log("Demo user signup attempt caught (likely already exists):", err);
      }
    }

    // 2. Explicitly force set the correct role in the database
    await db.collection("user").updateOne(
      { email },
      { $set: { role: role } }
    );

    // 3. Authenticate user server-side and return the native Better Auth response (with cookies)
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    return response;
  } catch (error: any) {
    console.error("POST Demo Login Error:", error);
    return NextResponse.json({ error: "Failed to authenticate demo user" }, { status: 500 });
  }
}
