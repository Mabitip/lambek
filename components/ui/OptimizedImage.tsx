import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils/cn";
import { IMAGE_BLUR } from "@/lib/constants/images";

type OptimizedImageProps = Omit<ImageProps, "quality" | "placeholder"> & {
  quality?: number;
  placeholder?: "blur" | "empty";
  variant?: "default" | "hero";
};

export function OptimizedImage({
  className,
  quality = 90,
  placeholder = "blur",
  blurDataURL = IMAGE_BLUR,
  sizes,
  alt,
  variant = "default",
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      alt={alt}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      className={cn(
        "object-cover",
        variant === "hero" && "rounded-none",
        className,
      )}
      {...props}
    />
  );
}
