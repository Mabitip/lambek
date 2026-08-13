import { cn } from "@/lib/utils/cn";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: "default" | "gold" | "outline" | "success" | "warning" }) {
  const variants = {
    default: "bg-primary/10 text-primary",
    gold: "bg-secondary/20 text-charcoal",
    outline: "border border-border text-foreground",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "default" | "gold" | "success" | "warning"> = {
    PENDING: "warning",
    CONTACTED: "default",
    APPROVED: "success",
    SHIPPED: "gold",
    COMPLETED: "success",
    REJECTED: "outline" as "default",
    AVAILABLE: "success",
    LIMITED: "warning",
    PREORDER: "gold",
    SOLD_OUT: "default",
    UNAVAILABLE: "default",
  };

  return <Badge variant={map[status] ?? "default"}>{status.replace(/_/g, " ")}</Badge>;
}
