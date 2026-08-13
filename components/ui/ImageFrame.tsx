import { cn } from "@/lib/utils/cn";

type ImageFrameSize = "default" | "lg" | "hero-bottom";

interface ImageFrameProps {
  children: React.ReactNode;
  className?: string;
  size?: ImageFrameSize;
  hover?: boolean;
  aspect?: string;
}

const sizeClasses: Record<ImageFrameSize, string> = {
  default: "media-frame",
  lg: "media-frame media-frame-lg",
  "hero-bottom": "page-hero-shell",
};

export function ImageFrame({
  children,
  className,
  size = "default",
  hover = false,
  aspect,
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        "relative",
        sizeClasses[size],
        hover && "media-frame-hover",
        aspect,
        className,
      )}
    >
      {children}
    </div>
  );
}
