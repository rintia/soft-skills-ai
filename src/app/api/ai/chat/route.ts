import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await request.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("softskills");
    
    // Fetch all courses so the AI has context on what courses are available
    const courses = await db.collection("courses").find({}).toArray();

    const responseText = await generateChatResponse(message, history, courses);
    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("API AI Chat Error:", error);
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 });
  }
}
