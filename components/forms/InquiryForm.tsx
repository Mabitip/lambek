"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  inquirySchema,
  sampleRequestSchema,
  contactSchema,
  type InquiryInput,
  type SampleRequestInput,
  type ContactInput,
} from "@/lib/validations/schemas";
import { INQUIRY_TYPES, BRAND } from "@/lib/constants/brand";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function InquiryForm({ coffees = [] }: { coffees?: { id: string; name: string }[] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { requestType: "GREEN_COFFEE" },
  });

  async function onSubmit(data: InquiryInput) {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? "Submission failed");
      setStatus("success");
      reset();
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-sm">
        <h3 className="font-serif text-2xl text-primary">Thank You</h3>
        <p className="mt-2 text-foreground/70">Your inquiry has been received. We will contact you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Full Name" error={errors.fullName?.message}>
          <Input {...register("fullName")} />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <Input {...register("company")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input {...register("phone")} />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <Input {...register("country")} />
        </Field>
        <Field label="Request Type" error={errors.requestType?.message}>
          <Select {...register("requestType")}>
            {INQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Interested Coffee" error={errors.interestedCoffee?.message}>
          {coffees.length > 0 ? (
            <Select {...register("coffeeId")}>
              <option value="">Select coffee (optional)</option>
              {coffees.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          ) : (
            <Input {...register("interestedCoffee")} placeholder="Coffee name" />
          )}
        </Field>
        <Field label="Preferred Process" error={errors.preferredProcess?.message}>
          <Input {...register("preferredProcess")} />
        </Field>
        <Field label="Estimated Quantity" error={errors.estimatedQuantity?.message}>
          <Input {...register("estimatedQuantity")} placeholder="e.g. 1 container" />
        </Field>
      </div>
      <Field label="Message" error={errors.message?.message}>
        <Textarea {...register("message")} rows={5} />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={status === "loading"} className="w-full md:w-auto">
        {status === "loading" ? "Submitting..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}

export function SampleRequestForm({
  coffees = [],
  defaultCoffeeSlug,
}: {
  coffees?: { id: string; name: string; slug: string }[];
  defaultCoffeeSlug?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const defaultCoffee = coffees.find((c) => c.slug === defaultCoffeeSlug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SampleRequestInput>({
    resolver: zodResolver(sampleRequestSchema),
    defaultValues: { coffeeId: defaultCoffee?.id ?? "" },
  });

  async function onSubmit(data: SampleRequestInput) {
    setStatus("loading");
    try {
      const res = await fetch("/api/sample-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? "Submission failed");
      setStatus("success");
      reset();
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-sm">
        <h3 className="font-serif text-2xl text-primary">Sample Request Received</h3>
        <p className="mt-2 text-foreground/70">We will review your request and contact you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <Field label="Coffee" error={errors.coffeeId?.message}>
        <Select {...register("coffeeId")}>
          <option value="">Select coffee (optional)</option>
          {coffees.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Company" error={errors.company?.message}>
          <Input {...register("company")} />
        </Field>
        <Field label="Name" error={errors.name?.message}>
          <Input {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <Input {...register("country")} />
        </Field>
        <Field label="Quantity" error={errors.quantity?.message}>
          <Input {...register("quantity")} placeholder="e.g. 250g" />
        </Field>
      </div>
      <Field label="Message" error={errors.message?.message}>
        <Textarea {...register("message")} rows={4} />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Request Sample"}
      </Button>
    </form>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-sm">
        <h3 className="font-serif text-2xl">Message Sent</h3>
        <p className="mt-2 text-foreground/70">Thank you for contacting {BRAND.name}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field label="Name" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} />
      </Field>
      <Field label="Subject" error={errors.subject?.message}>
        <Input {...register("subject")} />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <Textarea {...register("message")} rows={5} />
      </Field>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
