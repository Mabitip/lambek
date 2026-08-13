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
      <div className="w-full max-w-md border border-border bg-card p-8">
        <h1 className="font-serif text-3xl text-primary">{BRAND.wordmark} Admin</h1>
        <p className="mt-2 text-sm text-foreground/60">Sign in to manage content</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
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
