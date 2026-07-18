"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatBubble() {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hi! I am your Soft Skills AI Assistant. I know about all the courses on our platform. How can I help you elevate your career today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // If user is not logged in, do not show chat bubble
  if (!session?.user) return null;

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = textToSend.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      // Map history format to match Gemini API expectation
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "model", text: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "Sorry, I had trouble processing that request. Please try again." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Failed to connect to AI assistant. Please check your network." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend(message);
    }
  };

  // Convert markdown [Link Text](url) into proper Next.js React elements
  const parseMarkdownLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        elements.push(text.substring(lastIndex, matchIndex));
      }
      elements.push(
        <Link
          key={matchIndex}
          href={match[2]}
          onClick={() => setIsOpen(false)}
          className="text-teal-600 dark:text-teal-400 font-bold hover:underline underline-offset-2 hover:opacity-85 inline-flex items-center gap-0.5"
        >
          {match[1]}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements.length > 0 ? (
      <>
        {elements.map((el, i) => (
          <span key={i}>{el}</span>
        ))}
      </>
    ) : (
      <span>{text}</span>
    );
  };

  const quickQuestions = [
    "How to improve public speaking?",
    "Show leadership courses",
    "Time management tips",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[360px] flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between bg-teal-600 dark:bg-teal-900/60 p-4 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">AI Soft Skills Assistant</h4>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] text-teal-100 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-teal-100 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-teal-600 text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none border border-border"
                  }`}
                >
                  {msg.role === "model" ? parseMarkdownLinks(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex w-full justify-start">
                <div className="flex items-center gap-2 max-w-[80%] rounded-2xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground rounded-bl-none">
                  <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Predefined Quick Questions */}
          {messages.length === 1 && (
            <div className="p-3 border-t border-border bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2 block">
                Quick Prompts
              </span>
              <div className="flex flex-col gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="w-full text-left text-xs bg-card hover:bg-teal-500/5 hover:text-teal-600 dark:hover:text-teal-400 border border-border rounded-lg px-3 py-1.5 font-medium transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="p-3 border-t border-border bg-card flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="h-9 px-3 rounded-lg text-xs"
            />
            <Button
              onClick={() => handleSend(message)}
              disabled={loading || !message.trim()}
              className="h-9 w-9 p-0 rounded-lg flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Circle Float Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-2xl hover:bg-teal-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 animate-bounce"
        style={{ animationDuration: "3s" }}
        id="ai-chat-bubble"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
}
