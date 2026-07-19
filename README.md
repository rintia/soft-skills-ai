# Soft Skills Mastery

Soft Skills Mastery is a modern, premium, and feature-rich Web Application designed to help professionals develop critical interpersonal and leadership skills. Powered by Next.js and integrated with Gemini Generative AI, the platform provides interactive learning, conversational support, and intuitive administration controls.

---
## Live link: https://soft-skills-ai.vercel.app

## 🚀 Tech Stack

- **Core Framework:** Next.js 16 (App Router, client/server rendering, Turbopack compilation).
- **Styling & UI:** Tailwind CSS v4 (Sleek dark modes, glassmorphism, responsive grids, custom keyframe transitions) with Lucide React for premium iconography.
- **Authentication:** Better Auth (Secure session management, email/password signup, Google Social OAuth login).
- **Database Layer:** MongoDB Atlas (Native driver for persistent storage) with `@better-auth/mongo-adapter` for auth tables.
- **State Management:** TanStack React Query (Optimized client-side fetch caching and automated query cache invalidations).
- **AI Integration:** `@google/generative-ai` (Gemini 1.5 Flash model for curriculum generation and support assistance).
- **Notifications:** Custom Toast Alerts (Lightweight React Context provider with slide-in animations).

---

## ✨ Features & Functionalities

### 🛡️ Authentication & User Access
- **Email & Password Authentication:** Standard sign-up and sign-in flows.
- **Google OAuth Integration:** Support for one-click social authentication.
- **One-Click Demo Access:** Instant testing capabilities with predefined roles:
  - **Demo Learner:** Instant student access to browse, enroll, review, and track courses.
  - **Demo Admin:** Instant access to the administrative dashboard with full catalog authority.

### 📚 Course Catalog & Discovery
- **Explore Page:** Grid display of all courses featuring advanced search filtering, category tabs, rating filters, price sliders, and sorting options.
- **Custom Pagination:** Integrated client-server pagination displaying 6 courses per page (supports dynamic sizing across the 16 default courses).
- **Detailed Syllabus:** Modular outlines, course difficulty levels, duration metadata, and interactive reviews.

### 💳 Enrollment & Learning Tracking
- **Mock Payment Gateway:** Interactive credit card checkout modal for course registration.
- **My Courses Portal:** A private tracking hub for students, updating dynamically on successful checkout.

### 🤖 Gemini generative AI Integrations
- **AI Course Outline Generator (Admin Only):** Autocompletes detailed course overviews, short summaries, structured curriculums, and SEO metadata based on a simple course title.
- **AI Support Assistant:** A persistent chat icon in the bottom-right corner that allows learners to ask questions, request career advice, and get custom course recommendations.

### 💼 Admin Management Panel
Administrators have access to a dedicated dashboard where they can oversee the catalog:
- **Add Courses:** Create courses from scratch or auto-fill curriculum structures using Gemini AI.
- **Edit Courses:** Modify titles, categories, descriptions, module outlines, pricing, and visual images.
- **Delete Courses:** Instantly remove outdated courses from the database.

### 🎨 Micro-interactions & Polish
- **Custom Toast System:** Slide-in alert popups notifying users of key events (Successful login, registration, enrollment, course creation, editing, and deletion).
- **Custom 404 Page:** A themed error landing screen ("Syllabus Deviation Detected") with smooth glowing icons to redirect users to correct paths.
- **Theme Favicon:** A customized vector mind-sync logo integrated into browser tab headers.

---

## 🛠️ Environment Configuration

Create a `.env.local` file in the root directory and add the following keys:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Better Auth Configuration
BETTER_AUTH_SECRET=your_32_character_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Social OAuth Credentials (required for Google Login)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini AI API Key (required for Generative outlines and Chatbot)
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📥 Seeding the Database

To clear your existing Atlas database and seed the default 16 premium courses, run the seeder script:

```bash
node seed.js
```

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Production Build
```bash
npm run start
```
