"use client";

import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Sparkles, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col space-y-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <Sparkles className="h-3.5 w-3.5" />
            Support Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Have questions about our AI tutor modules, group rates, or technical integration? Drop us a line.
          </p>
        </div>

        {/* Layout details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto w-full">
          {/* Info Details */}
          <div className="lg:col-span-5 space-y-8 bg-card border border-border p-8 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-foreground">Contact Information</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our support team is active Monday through Friday, 9am to 6pm EST. We typically reply within 24 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Email Support</span>
                  <span className="text-xs font-bold text-foreground">support@softskillsmastery.ai</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Phone Contact</span>
                  <span className="text-xs font-bold text-foreground">+1 (555) 459-0128</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Office HQ</span>
                  <span className="text-xs font-bold text-foreground">San Francisco, CA 94105</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-card border border-border p-8 rounded-3xl shadow-sm w-full">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="h-14 w-14 text-teal-500 mx-auto animate-bounce" />
                <h4 className="text-lg font-extrabold text-foreground">Message Sent Successfully!</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Thank you for contacting us. One of our support engineers will inspect your inquiry and email you back soon.
                </p>
                <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-xl text-xs h-10 px-5">
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Your Name</label>
                    <Input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="h-10 text-xs px-3 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Email Address</label>
                    <Input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="h-10 text-xs px-3 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Subject</label>
                  <Input
                    type="text"
                    required
                    placeholder="Technical inquiry / Partnership"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={loading}
                    className="h-10 text-xs px-3 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write details of your question here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full sm:w-auto h-11 rounded-xl flex items-center justify-center gap-2 font-bold px-6"
                >
                  {loading ? "Sending..." : "Submit Message"}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
