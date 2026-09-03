"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { BRAND } from "@/lib/constants/brand";
import { SITE_IMAGES } from "@/lib/constants/images";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: { email: string; password: string }) {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <OptimizedImage
            src={SITE_IMAGES.logoVerticalDarkGreen}
            alt={BRAND.name}
            width={120}
            height={120}
            className="logo-on-light h-24 w-auto object-contain"
          />
          <OptimizedImage
            src={SITE_IMAGES.logoVerticalWhite}
            alt={BRAND.name}
            width={120}
            height={120}
            className="logo-on-dark h-24 w-auto object-contain"
          />
          <span className="mt-4 rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Admin Portal
          </span>
          <p className="mt-2 text-sm text-foreground/60">Sign in to manage Lambek Coffee content</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" {...register("email")} className="mt-1" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...register("password")} className="mt-1" />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
