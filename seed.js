const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env.local file to parse MONGODB_URI
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*MONGODB_URI\s*=\s*(.*)\s*$/);
      if (match) {
        let uri = match[1].trim();
        // Remove surrounding quotes if any
        if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
          uri = uri.slice(1, -1);
        }
        return uri;
      }
    }
  }
  return null;
}

const MONGODB_URI = loadEnv() || process.env.MONGODB_URI;

const sampleCourses = [
  {
    id: "course-1",
    title: "Mastering Public Speaking & Presentation",
    shortDescription: "Conquer stage fright, design impactful slides, and deliver speeches that captivate and persuade any audience.",
    fullDescription: "Public speaking is a critical skill for career growth. This course takes you from a nervous speaker to a confident presenter. You will learn the psychology of stage fright, how to structure clear and engaging messages, and how to use your voice and body language to command the room. Through practical exercises, you will master the art of storytelling, impromptu speaking, and designing slide decks that support rather than distract from your message.",
    price: 49.99,
    rating: 4.8,
    category: "Communication",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    duration: "8 Hours",
    level: "Intermediate",
    modules: [
      "Introduction to Public Speaking and the Psychology of Audience Engagement",
      "Overcoming Stage Fright and Building Confidence",
      "Structuring Your Message: Opening, Body, and Closing",
      "Delivery Techniques: Vocal Variety, Pausing, and Body Language",
      "Designing Visual Aids and Delivering High-Impact Slide Presentations",
      "Impromptu Speaking and Q&A Management"
    ],
    reviews: [
      { userId: "user-1", userName: "Sarah Jenkins", rating: 5, comment: "This course completely transformed how I present in meetings. The vocal variety exercises were incredibly helpful!", createdAt: new Date("2026-06-15T10:00:00Z") },
      { userId: "user-2", userName: "Marcus Vance", rating: 4, comment: "Really solid content. Loved the tips on structuring slides.", createdAt: new Date("2026-06-20T14:30:00Z") }
    ],
    createdAt: new Date("2026-06-01T00:00:00Z")
  },
  {
    id: "course-2",
    title: "Leadership Foundations: Leading with Empathy",
    shortDescription: "Learn to build high-trust teams, communicate with empathy, and resolve workplace conflicts constructively.",
    fullDescription: "True leadership isn't about authority; it is about influence and trust. This course explores the foundations of empathetic leadership, giving you the tools to listen actively, support team members, and cultivate an inclusive work environment. You will examine leadership models, practice feedback structures that motivate, and learn conflict resolution strategies that turn disagreements into collaborative growth opportunities.",
    price: 59.99,
    rating: 4.9,
    category: "Leadership",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    duration: "10 Hours",
    level: "Beginner",
    modules: [
      "The Shift from Manager to Leader: Empathetic Frameworks",
      "Active Listening and Emotionally Intelligent Communication",
      "Building a Culture of Psychological Safety and Mutual Trust",
      "Delivering Constructive Feedback and Coaching Team Members",
      "Conflict Resolution and Navigating Team Disagreements",
      "Leading Teams Through Change and Organizational Transitions"
    ],
    reviews: [
      { userId: "user-3", userName: "David Kim", rating: 5, comment: "Absolutely essential for new managers. The active listening frameworks are practical and immediately applicable.", createdAt: new Date("2026-06-10T09:00:00Z") }
    ],
    createdAt: new Date("2026-06-02T00:00:00Z")
  },
  {
    id: "course-3",
    title: "Emotional Intelligence at Work",
    shortDescription: "Develop deep self-awareness, master self-regulation, and improve interpersonal relationship dynamics.",
    fullDescription: "Emotional intelligence (EQ) is the single biggest predictor of performance in the workplace. In this course, you will learn the four domains of EQ: self-awareness, self-management, social awareness, and relationship management. You will discover how to recognize emotional triggers, remain calm under high stress, read micro-expressions and group dynamics, and apply emotional intelligence to foster collaboration and manage relationships effectively.",
    price: 39.99,
    rating: 4.7,
    category: "Emotional Intelligence",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    duration: "6 Hours",
    level: "Beginner",
    modules: [
      "Defining Emotional Intelligence and Understanding the Brain",
      "Self-Awareness: Identifying Triggers and Behavioral Patterns",
      "Self-Regulation: Stress Management and Staying Calm Under Pressure",
      "Social Awareness: Reading the Room, Empathy, and Organizational Clues",
      "Relationship Management: Inspiring Others and Managing Team Harmony",
      "Creating a Personal EQ Action Plan"
    ],
    reviews: [
      { userId: "user-4", userName: "Elena Rostova", rating: 5, comment: "A life-changing course. It helped me understand my reactions at work and rebuild my relationship with my boss.", createdAt: new Date("2026-07-01T15:00:00Z") },
      { userId: "user-1", userName: "Sarah Jenkins", rating: 4, comment: "Very insightful and structured. Well worth the time.", createdAt: new Date("2026-07-05T11:20:00Z") }
    ],
    createdAt: new Date("2026-06-03T00:00:00Z")
  },
  {
    id: "course-4",
    title: "High-Impact Negotiation Strategies",
    shortDescription: "Master win-win negotiation frameworks, handle hardball tactics, and claim value in crucial business deals.",
    fullDescription: "Negotiation is not a battle; it is a collaborative problem-solving process. This advanced course teaches you the strategies used by top negotiators to secure win-win outcomes while claiming necessary value. You will learn to identify BATNA (Best Alternative to a Negotiated Agreement), establish anchor points, ask strategic questions, and defuse emotional conflicts. We will also analyze real-world case studies to help you negotiate salaries, sales, and partnerships.",
    price: 79.99,
    rating: 4.9,
    category: "Communication",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    duration: "12 Hours",
    level: "Advanced",
    modules: [
      "The Win-Win Negotiation Paradigm and Mutual Gains",
      "Preparation: BATNA, ZOPA, and Setting Negotiation Goals",
      "Value Creation vs. Value Claiming: Distributive and Integrative Strategies",
      "Psychological Aspects: Anchoring, Empathy, and Building Rapport",
      "Recognizing and Deflecting Hardball Tactics and Deception",
      "Closing Deals, Formulating Agreements, and Multi-Party Negotiations"
    ],
    reviews: [],
    createdAt: new Date("2026-06-04T00:00:00Z")
  },
  {
    id: "course-5",
    title: "Effective Time Management & Productivity",
    shortDescription: "Overcome procrastination, master time-blocking, and construct a system for distraction-free focus.",
    fullDescription: "Time is your most valuable non-renewable resource. This course provides a complete framework for taking control of your day. You will learn how to break the cycle of procrastination, categorize tasks using the Eisenhower Matrix, implement time-blocking, design a distraction-free digital workplace, and build energy management habits to sustain high productivity throughout the week.",
    price: 29.99,
    rating: 4.6,
    category: "Productivity",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    duration: "5 Hours",
    level: "Beginner",
    modules: [
      "The Psychology of Procrastination and How to Break It",
      "Task Prioritization: The Eisenhower Matrix and Pareto Principle",
      "Time-Blocking and Creating the Perfect Daily Schedule",
      "Eliminating Digital Distractions and Building Deep Focus Cycles",
      "Managing Work Energy vs. Managing Time",
      "Tools and Workflows for Long-Term Productivity Tracking"
    ],
    reviews: [
      { userId: "user-2", userName: "Marcus Vance", rating: 5, comment: "The daily scheduling and time blocking templates changed my life. Excellent course!", createdAt: new Date("2026-07-10T16:00:00Z") }
    ],
    createdAt: new Date("2026-06-05T00:00:00Z")
  },
  {
    id: "course-6",
    title: "Critical Thinking & Complex Problem Solving",
    shortDescription: "Identify cognitive biases, employ creative frameworks, and make sound decisions under uncertainty.",
    fullDescription: "We live in an information-heavy world where standard answers often fail. This course teaches you how to think critically and solve complex business problems. You will learn to spot cognitive biases in your decision-making, apply root cause analysis (like the 5 Whys and Fishbone diagram), run creative brainstorming sessions, and structure decision trees to evaluate multiple alternative solutions objectively.",
    price: 69.99,
    rating: 4.7,
    category: "Critical Thinking",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    duration: "9 Hours",
    level: "Intermediate",
    modules: [
      "Foundations of Critical Thinking: Logic and Reasoning",
      "Cognitive Biases: Recognizing Faulty Thinking in Yourself and Others",
      "Problem Identification: Root Cause Analysis and System Thinking",
      "Creative Solution Engineering: Lateral Thinking and Mind Mapping",
      "Decision-Making Frameworks Under Risk and Uncertainty",
      "Implementation Plans, KPI Definition, and Continuous Improvement"
    ],
    reviews: [],
    createdAt: new Date("2026-06-06T00:00:00Z")
  },
  {
    id: "course-7",
    title: "Intercultural Communication & Global Teams",
    shortDescription: "Navigate cultural differences, overcome biases, and build collaborative synergy in global, diverse workspaces.",
    fullDescription: "In an interconnected world, working across cultures is standard. This course provides tools to recognize cultural dimensions, adjust your communication style dynamically, and build psychological safety across global borders. You will explore high-context vs. low-context styles, tackle implicit biases, and adopt techniques for inclusive leadership that leverage team diversity as a core creative asset.",
    price: 44.99,
    rating: 4.7,
    category: "Communication",
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80",
    duration: "7 Hours",
    level: "Intermediate",
    modules: [
      "Understanding Cultural Dimensions in the Modern Workspace",
      "High vs. Low Context Communication and Active Adaptation",
      "Mitigating Unconscious Bias in Virtual Collaboration",
      "Inclusive Team Building: Techniques for Cross-Border Managers",
      "Navigating Time Zones, Tooling, and Intercultural Conflict"
    ],
    reviews: [],
    createdAt: new Date("2026-06-07T00:00:00Z")
  },
  {
    id: "course-8",
    title: "Crisis Leadership & Adaptive Management",
    shortDescription: "Lead with courage, make high-stakes decisions, and maintain organizational resilience during unexpected disruption.",
    fullDescription: "Crises test the core of any leader. This course outlines the framework for leading through high-uncertainty events. You will learn to form rapid-response crisis squads, communicate transparently under high pressure, map situational risks quickly, and pivot business strategies dynamically while maintaining team morale and reducing organizational burnout.",
    price: 64.99,
    rating: 4.9,
    category: "Leadership",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    duration: "11 Hours",
    level: "Advanced",
    modules: [
      "The Psychology of Crisis: Fear, Focus, and Decisiveness",
      "Rapid Situational Assessment and Dynamic Risk Modeling",
      "Transparent Communication: Managing Uncertainty with Stakeholders",
      "Empowering Teams and Delegating Responsibilities on the Fly",
      "Post-Disruption Recovery: Healing and Retrospectives"
    ],
    reviews: [],
    createdAt: new Date("2026-06-08T00:00:00Z")
  },
  {
    id: "course-9",
    title: "The Art of Persuasion & Influence",
    shortDescription: "Master psychological persuasion triggers, construct compelling arguments, and command executive presence.",
    fullDescription: "To drive initiatives forward, you must know how to align others with your vision. This course breaks down psychological triggers of influence based on behavioral science. You will master building credibility, framing ideas to align with stakeholder incentives, managing resistance gracefully, and commanding presence in front of executive audiences to secure buy-in.",
    price: 49.99,
    rating: 4.8,
    category: "Communication",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    duration: "8 Hours",
    level: "Intermediate",
    modules: [
      "The Science of Persuasion: Authority, Scarcity, and Reciprocity",
      "Framing Techniques: Matching Your Message to Stakeholder Motives",
      "Handling Objections: Resolving Cognitive Dissonance in Pitching",
      "Executive Presence: Vocal Quality, Posture, and Storytelling",
      "Persuasion Ethics: Distinguishing Influence from Manipulation"
    ],
    reviews: [],
    createdAt: new Date("2026-06-09T00:00:00Z")
  },
  {
    id: "course-10",
    title: "Stress Mastery & Burnout Prevention",
    shortDescription: "Deconstruct stress triggers, build neurological resilience, and cultivate high-capacity calm at work.",
    fullDescription: "Burnout is not caused by hard work, but by a lack of cognitive recovery. This course teaches you how to map your neurological stress responses, set boundaries, and engage in micro-recovery cycles. You will design a customized burnout-prevention protocol, master physiological regulation techniques, and adopt cognitive restructuring practices to remain calm and focused under intense pressure.",
    price: 34.99,
    rating: 4.6,
    category: "Emotional Intelligence",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    duration: "6 Hours",
    level: "Beginner",
    modules: [
      "The Neuroscience of Stress: Fight, Flight, and Recovery Modes",
      "Identifying Personal Burnout Triggers and Behavioral Patterns",
      "Micro-Recovery Strategies: Breathing, Focus Pivots, and Breaks",
      "Assertive Boundary Setting and Saying No in the Workplace",
      "Building Long-term Psychological Capital and Resilience"
    ],
    reviews: [],
    createdAt: new Date("2026-06-10T00:00:00Z")
  },
  {
    id: "course-11",
    title: "Agile Collaboration & Team Flow",
    shortDescription: "Eliminate functional silos, streamline feedback loops, and foster a team dynamic optimized for rapid iterations.",
    fullDescription: "High-performance teams do not occur by accident; they are designed. This course provides a blueprint for structuring agile collaborations. You will learn to optimize team feedback channels, establish clear responsibility boundaries without restricting innovation, run high-yield sprints, and cultivate mutual accountability to sustain peak performance and collective flow.",
    price: 39.99,
    rating: 4.7,
    category: "Productivity",
    imageUrl: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80",
    duration: "7 Hours",
    level: "Intermediate",
    modules: [
      "Psychological Frameworks of High-Trust Collaborations",
      "Designing Lean Feedback Loops and Project Retrospectives",
      "Silo Busting: Connecting Multi-Disciplinary Workflows",
      "Coordinating Sprints and Managing Shared Resources",
      "Maintaining Team Alignment and Dynamic Motivation Systems"
    ],
    reviews: [],
    createdAt: new Date("2026-06-11T00:00:00Z")
  },
  {
    id: "course-12",
    title: "System Thinking & Cognitive Biases",
    shortDescription: "Analyze complex feedback loops, identify operational bottlenecks, and neutralize bias in strategic choices.",
    fullDescription: "Simple solutions often create complex problems because they ignore systemic interactions. This course trains you to view issues through a system dynamics lens. You will identify key feedback loops, spot non-obvious operational bottlenecks, audit your decisions for cognitive shortcuts, and implement structural checks that ensure long-term problem resolution.",
    price: 59.99,
    rating: 4.8,
    category: "Critical Thinking",
    imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    duration: "9 Hours",
    level: "Intermediate",
    modules: [
      "Foundations of System Dynamics: Stocks, Flows, and Loops",
      "Identifying System Archetypes and Common Structural Traps",
      "Cognitive Biases in Decision Trees: Overcoming Confirmation Bias",
      "Operational Bottleneck Analysis and Lever-Point Identification",
      "Designing Structural Decision Audits for Corporate Leadership"
    ],
    reviews: [],
    createdAt: new Date("2026-06-12T00:00:00Z")
  },
  {
    id: "course-13",
    title: "Executive Mentorship & Growth Coaching",
    shortDescription: "Learn professional coaching frameworks, active inquiry, and structured pathways to develop top-tier talent.",
    fullDescription: "Great leaders do not create followers; they develop more leaders. This advanced course teaches professional coaching methodologies (like GROW model) to managers. You will master active inquiry, structured development pathways, situational feedback structures, and techniques to help your mentees unlock their full potential and take ownership of their career growth.",
    price: 74.99,
    rating: 4.9,
    category: "Leadership",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    duration: "10 Hours",
    level: "Advanced",
    modules: [
      "Mentorship vs. Management: Drawing the Distinction",
      "The GROW Coaching Model: Goals, Reality, Options, and Will",
      "Active Inquiry: Asking Powerful Questions to Foster Ownership",
      "Feedback Frameworks for Deep Personal Development",
      "Building Customized Learning Passports for Core Talent"
    ],
    reviews: [],
    createdAt: new Date("2026-06-13T00:00:00Z")
  },
  {
    id: "course-14",
    title: "Active Listening & Interpersonal Synergy",
    shortDescription: "Go beyond hearing to decode body language, emotional undertones, and build deep organizational rapport.",
    fullDescription: "Active listening is the cornerstone of trust. This course provides a hands-on methodology to elevate your conversational listening skills. You will learn to decode micro-expressions and posture shifts, apply verbal reflection techniques, control internal validation biases, and cultivate the deep emotional empathy that drives cohesive, high-trust professional relationships.",
    price: 29.99,
    rating: 4.8,
    category: "Communication",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    duration: "5 Hours",
    level: "Beginner",
    modules: [
      "The Levels of Listening: From Autopilot to Empathetic",
      "Body Language and Micro-Expression Identification",
      "Verbal Reflection and Strategic Summarization Techniques",
      "Neutralizing Inner Monologues and Interruption Impulses",
      "Applying Active Listening to High-Conflict Negotiations"
    ],
    reviews: [],
    createdAt: new Date("2026-06-14T00:00:00Z")
  },
  {
    id: "course-15",
    title: "Mindfulness at Work: Focus in a Distracted World",
    shortDescription: "Train your attention, manage task-switching costs, and establish mental clarity in high-velocity environments.",
    fullDescription: "In a world of constant alerts, attention is a superpower. This course introduces practical mindfulness strategies tailored for busy professionals. You will learn to reduce cognitive fatigue from context-switching, implement centering routines, maintain calm in chaotic meetings, and structure your focus blocks to maximize high-value output.",
    price: 39.99,
    rating: 4.7,
    category: "Productivity",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    duration: "6 Hours",
    level: "Beginner",
    modules: [
      "Attention Economy: Understanding Cognitive Exhaustion",
      "Mindfulness Exercises for the Modern Deskside Worker",
      "Reducing Context-Switching Penalties and High-Value Focus Blocks",
      "Emotional Grounding: Navigating In-Meeting Triggers",
      "Designing a Sustainable Workspace Centering Routine"
    ],
    reviews: [],
    createdAt: new Date("2026-06-15T00:00:00Z")
  },
  {
    id: "course-16",
    title: "Strategic Decision Making",
    shortDescription: "Master risk assessment grids, utilize game theory basics, and implement structural models for long-term decisions.",
    fullDescription: "Strategic choices require balancing immediate results against long-term operational health. This advanced course teaches decision modeling frameworks. You will leverage risk grids, weigh options using basic game theory, apply the red teaming concept, and design robust implementation audits that keep projects aligned with strategic company objectives.",
    price: 69.99,
    rating: 4.8,
    category: "Critical Thinking",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    duration: "8 Hours",
    level: "Advanced",
    modules: [
      "Deciding Under Uncertainty: Framing Choice Dimensions",
      "Risk Mitigation Grids: Assessing Likelihood vs. Impact",
      "Basic Game Theory: Anticipating Competitive Counteractions",
      "Red Teaming: Falsifying Choices and Identifying Blindspots",
      "Creating Decision Audits and Project Governance Checklists"
    ],
    reviews: [],
    createdAt: new Date("2026-06-16T00:00:00Z")
  }
];

async function seed() {
  if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not set in .env.local");
    process.exit(1);
  }
  console.log("Connecting to MongoDB Atlas Cluster...");
  console.log("Connection URI:", MONGODB_URI.substring(0, 45) + "...");
  
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("✓ Connected successfully to MongoDB Atlas!");

    const db = client.db("softskills");
    
    // Clear old sample courses if any to avoid duplicates
    console.log("Cleaning existing courses collection in MongoDB Atlas...");
    await db.collection("courses").deleteMany({ id: { $in: sampleCourses.map(c => c.id) } });

    console.log("Seeding sample courses to MongoDB Atlas...");
    const result = await db.collection("courses").insertMany(sampleCourses);
    console.log(`✓ Successfully seeded ${result.insertedCount} courses in softskills.courses collection!`);
  } catch (err) {
    console.error("❌ Seeding database Atlas connection failed:");
    console.error(err);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seed();
