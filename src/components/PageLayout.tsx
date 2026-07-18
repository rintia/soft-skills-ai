import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
