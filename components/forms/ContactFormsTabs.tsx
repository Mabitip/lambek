"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ContactForm, InquiryForm, SampleRequestForm } from "@/components/forms/InquiryForm";

type Tab = "message" | "inquiry" | "sample";

interface ContactFormsTabsProps {
  coffees: { id: string; name: string; slug: string }[];
  defaultCoffeeSlug?: string;
}

export function ContactFormsTabs({ coffees, defaultCoffeeSlug }: ContactFormsTabsProps) {
  const initialTab: Tab = defaultCoffeeSlug ? "sample" : "message";
  const [tab, setTab] = useState<Tab>(initialTab);

  const tabs: { id: Tab; label: string }[] = [
    { id: "message", label: "Send Message" },
    { id: "inquiry", label: "Business Inquiry" },
    { id: "sample", label: "Request Sample" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-3 text-sm uppercase tracking-wider transition",
              tab === t.id
                ? "border-b-2 border-primary text-primary"
                : "text-foreground/60 hover:text-primary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "message" && <ContactForm />}
      {tab === "inquiry" && (
        <InquiryForm coffees={coffees.map((c) => ({ id: c.id, name: c.name }))} />
      )}
      {tab === "sample" && (
        <SampleRequestForm coffees={coffees} defaultCoffeeSlug={defaultCoffeeSlug} />
      )}
    </div>
  );
}
