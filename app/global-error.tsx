"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-primary">Something went wrong</h1>
          <p className="mt-4 text-foreground/70">An unexpected error occurred. Please try again.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex h-11 items-center bg-primary px-8 text-sm uppercase tracking-widest text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
