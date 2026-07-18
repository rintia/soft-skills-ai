"use client";

import React from "react";
import PageLayout from "@/components/PageLayout";
import { Sparkles, HeartHandshake, Eye, Award } from "lucide-react";

export default function AboutPage() {
  const team = [
    { name: "Dr. Evelyn Vance", role: "Co-Founder & Chief Learning Architect", bio: "Former Harvard Business School professor specializing in organizational behavior and empathy modeling.", initials: "EV" },
    { name: "Aiden Croft", role: "Head of AI Design & Systems", bio: "AI developer focused on creating contextual, natural conversational tutors for soft skills training.", initials: "AC" },
    { name: "Lydia Patel", role: "Director of Curriculum & Pedagogy", bio: "Instructional designer who has built workforce development syllabi for Fortune 500 corporations.", initials: "LP" }
  ];

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col space-y-16">
        
        {/* Title / Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <Sparkles className="h-3.5 w-3.5" />
            Our Vision
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Bridging the Soft Skills Gap
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            We believe that technical expertise is only half the equation. True professional success requires mastery of human-centric soft skills.
          </p>
        </div>

        {/* Focus pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-4">
            <div className="h-11 w-11 bg-teal-500/10 text-teal-600 rounded-xl flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To provide accessible, high-fidelity soft skills training utilizing agentic artificial intelligence. We enable learners to practice high-stakes communications, conflict resolution, and leadership dynamics in a safe, automated environment.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-4">
            <div className="h-11 w-11 bg-teal-500/10 text-teal-600 rounded-xl flex items-center justify-center">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Core Competencies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We structure training across critical workforce pillars: empathetic leadership, structured active listening, high-impact negotiation, logical critical thinking, and energy-based productivity mapping.
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="space-y-8 pt-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Our Team</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Curated professionals committed to developing human capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 font-extrabold text-xl flex items-center justify-center">
                  {member.initials}
                </div>
                <div>
                  <h4 className="font-extrabold text-foreground text-sm">{member.name}</h4>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold block mt-1 uppercase tracking-wider">{member.role}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
