import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-secondary">404</p>
      <h1 className="mt-4 font-serif text-4xl text-primary">Page Not Found</h1>
      <p className="mt-4 max-w-md text-foreground/70">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center bg-primary px-8 text-sm uppercase tracking-widest text-white"
      >
        Return Home
      </Link>
    </div>
  );
}
