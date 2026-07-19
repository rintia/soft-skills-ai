import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/softskills';
const DB_JSON_PATH = path.join(process.cwd(), 'db.json');

// Sample Course Data to Seed
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

// Helper to generate a simple UUID for mock operations
function generateUuid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// -------------------------------------------------------------
// IN-MEMORY / FILE-BASED MOCK MONGODB DRIVER FALLBACK
// -------------------------------------------------------------

class MockCursor {
  private items: any[];
  constructor(items: any[]) {
    this.items = items;
  }
  sort(sortObj: any) {
    const keys = Object.keys(sortObj);
    if (keys.length > 0) {
      const key = keys[0];
      const order = sortObj[key];
      this.items.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        if (valA instanceof Date) valA = valA.getTime();
        if (valB instanceof Date) valB = valB.getTime();
        if (valA < valB) return order === -1 ? 1 : -1;
        if (valA > valB) return order === -1 ? -1 : 1;
        return 0;
      });
    }
    return this;
  }
  skip(n: number) {
    this.items = this.items.slice(n);
    return this;
  }
  limit(n: number) {
    this.items = this.items.slice(0, n);
    return this;
  }
  project(projection: any) {
    // Basic projection support
    this.items = this.items.map(item => {
      const projected: any = {};
      for (const k of Object.keys(projection)) {
        if (projection[k] === 1) {
          projected[k] = item[k];
        }
      }
      if (projection._id === undefined && item._id) {
        projected._id = item._id;
      }
      return projected;
    });
    return this;
  }
  async toArray() {
    return this.items;
  }
}

class MockCollection {
  private name: string;
  private db: MockDb;

  constructor(name: string, db: MockDb) {
    this.name = name;
    this.db = db;
  }

  private getData(): any[] {
    const allData = this.db.readData();
    if (!allData[this.name]) {
      allData[this.name] = [];
      this.db.writeData(allData);
    }
    return allData[this.name];
  }

  private saveData(data: any[]) {
    const allData = this.db.readData();
    allData[this.name] = data;
    this.db.writeData(allData);
  }

  private matches(item: any, filter: any): boolean {
    if (!filter) return true;
    for (const key of Object.keys(filter)) {
      const val = filter[key];

      if (key === '$or') {
        if (Array.isArray(val)) {
          const matchesAny = val.some(subFilter => this.matches(item, subFilter));
          if (!matchesAny) return false;
          continue;
        }
      }

      if (key === '$and') {
        if (Array.isArray(val)) {
          const matchesAll = val.every(subFilter => this.matches(item, subFilter));
          if (!matchesAll) return false;
          continue;
        }
      }

      // Handle ID normalization
      if (key === '_id' || key === 'id') {
        const itemVal = item[key] || item.id || item._id;
        if (val && typeof val === 'object') {
          if ('$in' in val && Array.isArray(val.$in)) {
            if (!val.$in.map((x: any) => String(x)).includes(String(itemVal))) return false;
            continue;
          }
        }
        if (String(itemVal) !== String(val)) return false;
        continue;
      }

      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        const itemVal = item[key];
        if ('$in' in val && Array.isArray(val.$in)) {
          if (!val.$in.includes(itemVal)) return false;
        } else if ('$nin' in val && Array.isArray(val.$nin)) {
          if (val.$nin.includes(itemVal)) return false;
        } else if ('$gt' in val) {
          if (!(itemVal > val.$gt)) return false;
        } else if ('$lt' in val) {
          if (!(itemVal < val.$lt)) return false;
        } else if ('$gte' in val) {
          if (!(itemVal >= val.$gte)) return false;
        } else if ('$lte' in val) {
          if (!(itemVal <= val.$lte)) return false;
        } else if ('$ne' in val) {
          if (itemVal === val.$ne) return false;
        }
      } else {
        if (item[key] !== val) return false;
      }
    }
    return true;
  }

  async findOne(filter: any) {
    const data = this.getData();
    const found = data.find(item => this.matches(item, filter));
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  find(filter: any) {
    const data = this.getData();
    const matched = data.filter(item => this.matches(item, filter));
    return new MockCursor(JSON.parse(JSON.stringify(matched)));
  }

  async insertOne(doc: any) {
    const data = this.getData();
    const newDoc = { ...doc };
    if (!newDoc._id && !newDoc.id) {
      newDoc._id = generateUuid();
    }
    if (!newDoc.id && newDoc._id) {
      newDoc.id = String(newDoc._id);
    }
    data.push(newDoc);
    this.saveData(data);
    return { acknowledged: true, insertedId: newDoc._id || newDoc.id };
  }

  async insertMany(docs: any[]) {
    const data = this.getData();
    const insertedIds: any = {};
    const processed = docs.map((doc, idx) => {
      const newDoc = { ...doc };
      if (!newDoc._id && !newDoc.id) {
        newDoc._id = generateUuid();
      }
      if (!newDoc.id && newDoc._id) {
        newDoc.id = String(newDoc._id);
      }
      insertedIds[idx] = newDoc._id || newDoc.id;
      return newDoc;
    });
    data.push(...processed);
    this.saveData(data);
    return { acknowledged: true, insertedCount: docs.length, insertedIds };
  }

  async updateOne(filter: any, update: any, options: any = {}) {
    const data = this.getData();
    let index = data.findIndex(item => this.matches(item, filter));
    let matchedCount = index !== -1 ? 1 : 0;
    let modifiedCount = 0;

    if (index === -1) {
      if (options.upsert) {
        const newDoc: any = {};
        if (filter) {
          for (const k of Object.keys(filter)) {
            if (!k.startsWith('$')) {
              newDoc[k] = filter[k];
            }
          }
        }
        if (update.$setOnInsert) {
          Object.assign(newDoc, update.$setOnInsert);
        }
        if (update.$set) {
          Object.assign(newDoc, update.$set);
        }
        if (!newDoc._id && !newDoc.id) {
          newDoc._id = generateUuid();
        }
        if (!newDoc.id && newDoc._id) {
          newDoc.id = String(newDoc._id);
        }
        data.push(newDoc);
        this.saveData(data);
        return { acknowledged: true, matchedCount: 0, modifiedCount: 1, upsertedId: newDoc._id || newDoc.id, upsertedCount: 1 };
      }
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    }

    const item = data[index];
    if (update.$set) {
      for (const key of Object.keys(update.$set)) {
        item[key] = update.$set[key];
      }
      modifiedCount = 1;
    }
    if (update.$unset) {
      for (const key of Object.keys(update.$unset)) {
        delete item[key];
      }
      modifiedCount = 1;
    }
    if (update.$push) {
      for (const key of Object.keys(update.$push)) {
        if (!Array.isArray(item[key])) {
          item[key] = [];
        }
        // Handle $each modifiers
        const val = update.$push[key];
        if (val && typeof val === 'object' && '$each' in val && Array.isArray(val.$each)) {
          item[key].push(...val.$each);
        } else {
          item[key].push(val);
        }
      }
      modifiedCount = 1;
    }
    this.saveData(data);
    return { acknowledged: true, matchedCount, modifiedCount };
  }

  async deleteOne(filter: any) {
    const data = this.getData();
    const index = data.findIndex(item => this.matches(item, filter));
    if (index !== -1) {
      data.splice(index, 1);
      this.saveData(data);
      return { acknowledged: true, deletedCount: 1 };
    }
    return { acknowledged: true, deletedCount: 0 };
  }

  async deleteMany(filter: any) {
    const data = this.getData();
    const initialCount = data.length;
    const remaining = data.filter(item => !this.matches(item, filter));
    const deletedCount = initialCount - remaining.length;
    this.saveData(remaining);
    return { acknowledged: true, deletedCount };
  }

  async countDocuments(filter: any) {
    const data = this.getData();
    const matched = data.filter(item => this.matches(item, filter));
    return matched.length;
  }

  async createIndex(keys: any, options: any = {}) {
    // Indexes are no-ops for our Mock database
    return "mock_index";
  }

  async createIndexes(indexSpecs: any[], options: any = {}) {
    return ["mock_index"];
  }

  listIndexes() {
    return {
      toArray: async () => []
    };
  }

  async indexes() {
    return [];
  }

  async options() {
    return {};
  }

  async dropIndex(name: string) {
    return true;
  }

  aggregate(pipeline: any[], options: any = {}) {
    let data = JSON.parse(JSON.stringify(this.getData()));

    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter((item: any) => this.matches(item, stage.$match));
      }
      if (stage.$sort) {
        const sortKeys = Object.keys(stage.$sort);
        if (sortKeys.length > 0) {
          const key = sortKeys[0];
          const dir = stage.$sort[key];
          data.sort((a: any, b: any) => {
            if (a[key] < b[key]) return dir === 1 ? -1 : 1;
            if (a[key] > b[key]) return dir === 1 ? 1 : -1;
            return 0;
          });
        }
      }
      if (stage.$skip) {
        data = data.slice(stage.$skip);
      }
      if (stage.$limit) {
        data = data.slice(0, stage.$limit);
      }
      if (stage.$count) {
        const countKey = stage.$count;
        data = [{ [countKey]: data.length }];
      }
      if (stage.$project) {
        const projectKeys = Object.keys(stage.$project);
        data = data.map((item: any) => {
          const newItem: any = {};
          for (const pk of projectKeys) {
            if (stage.$project[pk] === 1) {
              newItem[pk] = item[pk];
            }
          }
          if (stage.$project._id !== 0 && item._id !== undefined) {
            newItem._id = item._id;
          }
          if (stage.$project.id !== 0 && item.id !== undefined) {
            newItem.id = item.id;
          }
          return newItem;
        });
      }
    }

    return {
      toArray: async () => data
    };
  }

  async findOneAndUpdate(filter: any, update: any, options: any = {}) {
    const data = this.getData();
    const index = data.findIndex(item => this.matches(item, filter));
    if (index === -1) {
      return { value: null };
    }
    const item = data[index];
    if (update.$set) {
      Object.assign(item, update.$set);
    }
    this.saveData(data);
    return { value: JSON.parse(JSON.stringify(item)) };
  }

  async findOneAndDelete(filter: any, options: any = {}) {
    const data = this.getData();
    const index = data.findIndex(item => this.matches(item, filter));
    if (index === -1) {
      return { value: null };
    }
    const item = data.splice(index, 1)[0];
    this.saveData(data);
    return { value: JSON.parse(JSON.stringify(item)) };
  }
}

class MockDb {
  public dbName: string;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.initFile();
  }

  private initFile() {
    if (!fs.existsSync(DB_JSON_PATH)) {
      fs.writeFileSync(DB_JSON_PATH, JSON.stringify({
        user: [],
        session: [],
        account: [],
        verification: [],
        courses: sampleCourses,
        enrollments: []
      }, null, 2));
    } else {
      // Ensure courses table exists and contains sample data if empty
      const allData = this.readData();
      if (!allData.courses || allData.courses.length === 0) {
        allData.courses = sampleCourses;
        this.writeData(allData);
      }
    }
  }

  public readData(): any {
    try {
      if (!fs.existsSync(DB_JSON_PATH)) {
        this.initFile();
      }
      const raw = fs.readFileSync(DB_JSON_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading mock DB file, returning empty state:', e);
      return {};
    }
  }

  public writeData(data: any) {
    try {
      fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Error writing mock DB file:', e);
    }
  }

  collection(name: string) {
    return new MockCollection(name, this);
  }

  async createCollection(name: string) {
    return this.collection(name);
  }

  async dropCollection(name: string) {
    const allData = this.readData();
    delete allData[name];
    this.writeData(allData);
    return true;
  }

  listCollections() {
    return {
      toArray: async () => [
        { name: "user" },
        { name: "session" },
        { name: "account" },
        { name: "verification" }
      ]
    };
  }

  async command(cmd: any) {
    return { ok: 1 };
  }
}

class MockMongoClient {
  private dbInstance: MockDb | null = null;

  constructor(uri: string) {}

  async connect() {
    console.log('MockMongoClient successfully connected simulation database.');
    return this as any;
  }

  db(dbName: string = 'softskills') {
    if (!this.dbInstance || this.dbInstance.dbName !== dbName) {
      this.dbInstance = new MockDb(dbName);
    }
    return this.dbInstance as any;
  }

  on(event: string, listener: any) {
    return this as any;
  }

  once(event: string, listener: any) {
    return this as any;
  }

  off(event: string, listener: any) {
    return this as any;
  }

  async close() {
    console.log('MockMongoClient successfully closed connection.');
    return;
  }

  startSession() {
    return {
      startTransaction() {},
      commitTransaction() {},
      abortTransaction() {},
      endSession() {}
    };
  }
}

// -------------------------------------------------------------
// CONNECTION GATEWAY WITH TIMEOUT FALLBACK
// -------------------------------------------------------------

let client: any;
let clientPromise: Promise<any>;

// Function to check if a MongoDB server is actually available on MONGODB_URI
function testMongoConnection(uri: string): Promise<boolean> {
  return new Promise((resolve) => {
    const tempClient = new MongoClient(uri, { serverSelectionTimeoutMS: 100 });
    tempClient.connect()
      .then(() => {
        tempClient.close();
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

// Global variable setup to persist in hot module reloads
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<any>;
};

if (globalWithMongo._mongoClientPromise) {
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // We construct a promise that tests the connection and either boots the real Client or fallback Mock
  clientPromise = (async () => {
    // If local development environment detected, test connection before resolving MockMongoClient
    const isLocalFallback = MONGODB_URI.includes("localhost") || MONGODB_URI.includes("127.0.0.1");

    if (isLocalFallback) {
      const isMongoAvailable = await testMongoConnection(MONGODB_URI);
      if (isMongoAvailable) {
        console.log(`✓ Active local MongoDB server detected at ${MONGODB_URI}. Connecting...`);
        try {
          const realClient = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 2000
          });
          const conn = await realClient.connect();
          console.log('✓ Successfully established connection with local MongoDB server.');
          return conn;
        } catch (err) {
          console.warn(`Local MongoDB connection attempt failed. Falling back to MockMongoClient:`, err);
        }
      }

      console.warn(`Local MongoDB server not running on URI ${MONGODB_URI}. Resolving MockMongoClient fallback (writing to db.json).`);
      const mockClient = new MockMongoClient(MONGODB_URI);
      return mockClient.connect();
    }


    console.log(`Connecting to remote MongoDB Atlas database...`);
    try {
      const realClient = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000 // 5 seconds connection selection allowance for Atlas
      });
      const conn = await realClient.connect();
      console.log('✓ Successfully established connection with remote MongoDB Atlas.');

      // Perform dynamic collection seeding check on connect
      try {
        const db = conn.db("softskills");
        const count = await db.collection("courses").countDocuments({});
        if (count === 0) {
          console.log("Seeding sample courses to remote MongoDB Atlas database...");
          await db.collection("courses").insertMany(sampleCourses);
          console.log("✓ Successfully seeded sample courses on Atlas.");
        }
      } catch (seedErr) {
        console.error("Seeding real MongoDB Atlas failed:", seedErr);
      }

      return conn;
    } catch (error) {
      console.error("❌ Failed to connect to remote MongoDB Atlas database:", error);
      throw error;
    }
  })();

  if (process.env.NODE_ENV === 'development') {
    globalWithMongo._mongoClientPromise = clientPromise;
  }
}

export default clientPromise;
