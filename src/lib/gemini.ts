import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const hasApiKey = !!apiKey && apiKey !== "YOUR_API_KEY_HERE" && apiKey.trim() !== "";

const genAI = hasApiKey ? new GoogleGenerativeAI(apiKey) : null;

// Mock fallback for course creation auto-fill
export function generateCourseMock(title: string, category: string) {
  return {
    shortDescription: `Master the essential principles of ${title} in this highly interactive, action-oriented ${category} course.`,
    fullDescription: `# Course Overview\n\nWelcome to **${title}**! In today's professional landscape, technical abilities alone are not enough. Success requires mastery of ${category}.\n\nThis course is specifically structured to help you develop and internalize high-performance habits. Through a combination of engaging video lectures, interactive roleplay simulations, and concrete action guides, you will acquire skills that can be applied immediately in your career.\n\n## Key Learning Outcomes\n\n- Understand the core methodologies of ${title}.\n- Identify personal triggers and communication bottlenecks.\n- Learn best practices for managing team relations and workflows.\n- Create a personal roadmap for ongoing skill refinement.`,
    modules: [
      `Foundations of ${title}: Core Principles and Concepts`,
      `Practical Frameworks and Interactive Worksheets`,
      `Developing Strategies for High-Stakes Scenarios`,
      `Case Studies: Analyzing Successes and Common Pitfalls`,
      `Your Implementation Plan and Continuous Growth Metrics`
    ],
    seoMetaTags: {
      title: `${title} | Soft Skills Mastery`,
      description: `Boost your career potential by mastering ${title}. Join our ${category} course today to start learning!`
    }
  };
}

// Mock fallback for chatbot queries
export function chatMock(message: string, coursesContext: any[] = []) {
  const msg = message.toLowerCase();
  
  // Basic greetings
  if (msg.includes("hello") || msg.includes("hi ") || msg.includes("hey")) {
    return "Hello! I am your AI Course Assistant. I'm here to answer questions about soft skills and recommend specific courses from our catalog. What skills are you looking to improve today?";
  }

  // Check if we can find matching courses from the catalog context
  const matches: any[] = [];
  
  // Keyword matchers mapping to courses
  if (msg.includes("speak") || msg.includes("public speaking") || msg.includes("presentation") || msg.includes("talk")) {
    const speakCourse = coursesContext.find(c => c.id === "course-1" || c.title.toLowerCase().includes("public speaking"));
    if (speakCourse) matches.push(speakCourse);
  }
  if (msg.includes("lead") || msg.includes("leadership") || msg.includes("manager") || msg.includes("team")) {
    const leadCourse = coursesContext.find(c => c.id === "course-2" || c.title.toLowerCase().includes("leadership"));
    if (leadCourse) matches.push(leadCourse);
  }
  if (msg.includes("eq") || msg.includes("emotional intelligence") || msg.includes("self-awareness") || msg.includes("empathy")) {
    const eqCourse = coursesContext.find(c => c.id === "course-3" || c.title.toLowerCase().includes("emotional"));
    const leadCourse = coursesContext.find(c => c.id === "course-2" || c.title.toLowerCase().includes("leadership"));
    if (eqCourse) matches.push(eqCourse);
    if (leadCourse && !matches.includes(leadCourse)) matches.push(leadCourse);
  }
  if (msg.includes("negotiat") || msg.includes("salary") || msg.includes("bargain") || msg.includes("deal")) {
    const negCourse = coursesContext.find(c => c.id === "course-4" || c.title.toLowerCase().includes("negotiation"));
    if (negCourse) matches.push(negCourse);
  }
  if (msg.includes("time") || msg.includes("productivity") || msg.includes("procrastinat") || msg.includes("focus")) {
    const prodCourse = coursesContext.find(c => c.id === "course-5" || c.title.toLowerCase().includes("productivity") || c.title.toLowerCase().includes("time"));
    if (prodCourse) matches.push(prodCourse);
  }
  if (msg.includes("think") || msg.includes("problem solve") || msg.includes("decision") || msg.includes("logic")) {
    const thinkCourse = coursesContext.find(c => c.id === "course-6" || c.title.toLowerCase().includes("critical") || c.title.toLowerCase().includes("problem"));
    if (thinkCourse) matches.push(thinkCourse);
  }

  if (matches.length > 0) {
    let response = `Based on your request, I highly recommend checking out these courses from our catalog:\n\n`;
    matches.forEach(c => {
      response += `- **[${c.title}](/courses/${c.id || c._id})** (${c.category}): ${c.shortDescription}\n`;
    });
    response += `\nYou can click the links above to view full details and enroll. Let me know if you would like more tips on these topics!`;
    return response;
  }

  // Fallback to course listing
  if (msg.includes("course") || msg.includes("recommend") || msg.includes("catalog") || msg.includes("what do you have")) {
    let response = "We offer a curated selection of soft skills courses to boost your career. Here is our catalog:\n\n";
    coursesContext.forEach(c => {
      response += `- **[${c.title}](/courses/${c.id || c._id})** (${c.category}) - $${c.price}\n`;
    });
    response += "\nWhich area are you interested in developing?";
    return response;
  }

  return "I'd love to help you grow your soft skills! We have courses on **Communication**, **Leadership**, **Emotional Intelligence**, **Productivity**, and **Critical Thinking**. Try asking about one of these topics, or view our full selection on the [Explore Page](/courses).";
}

// 1. AI API Call to generate Course Content
export async function generateCourseContent(title: string, category: string) {
  if (!genAI) {
    return generateCourseMock(title, category);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an expert curriculum designer. Generate course contents for a soft skills course.
Course Title: "${title}"
Category: "${category}"

Return a JSON object exactly matching this TypeScript interface structure:
{
  "shortDescription": "string (1-2 sentence compelling summary)",
  "fullDescription": "string (rich markdown formatted overview with bullet points and learning outcomes)",
  "modules": ["string (module 1 title)", "string (module 2 title)", "string (module 3 title)", "string (module 4 title)", "string (module 5 title)"],
  "seoMetaTags": {
    "title": "string (SEO optimized title tag)",
    "description": "string (compelling meta description under 160 chars)"
  }
}
Keep descriptions professional and engaging. Do not wrap in markdown json block. Return pure json.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini course generation error, falling back:", error);
    return generateCourseMock(title, category);
  }
}

// 2. AI API Call to handle chatbot conversation
export async function generateChatResponse(message: string, history: any[], coursesContext: any[]) {
  if (!genAI) {
    return chatMock(message, coursesContext);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format course catalog context for the model system prompt
    const coursesStr = coursesContext.map(c => 
      `Course ID: ${c.id || c._id}\nTitle: ${c.title}\nCategory: ${c.category}\nShort Description: ${c.shortDescription}\nPrice: $${c.price}\nRating: ${c.rating}\nDuration: ${c.duration}\nLevel: ${c.level}\nUrl: /courses/${c.id || c._id}`
    ).join("\n\n");

    const systemPrompt = `You are a helpful AI Course Assistant for the "Soft Skills Mastery" educational platform.
Your goal is to answer users' soft skills questions, help them navigate the platform, and recommend specific courses.
Below is the official course catalog currently available on the platform:

${coursesStr}

Guidelines:
1. When recommending a course, you MUST mention its exact title and provide a markdown link to it in this format: [Course Title](/courses/course-id).
2. Answer the user's questions about soft skills (e.g. how to communicate, manage time, etc.) using professional, encouraging advice.
3. Be concise and conversational.
4. Keep the context of the chat history in mind.`;

    // Format chat history for Gemini API
    const formattedContents = history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.parts?.[0]?.text || h.message || "" }]
    }));

    // Add current user message to contents
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const chat = model.startChat({
      history: formattedContents.slice(0, -1), // everything except last message
      systemInstruction: systemPrompt
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Gemini chat response error, falling back:", error);
    return chatMock(message, coursesContext);
  }
}
