"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedMedia {
  id: string;
  url: string;
  altText?: string | null;
  originalName: string;
}

interface ImageUploaderProps {
  onUploaded?: (media: UploadedMedia) => void;
  existingImages?: UploadedMedia[];
  onRemove?: (id: string) => void;
}

export function ImageUploader({ onUploaded, existingImages = [], onRemove }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", file.name);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!json.success) throw new Error(json.error?.message ?? "Upload failed");
      onUploaded?.(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted/30 p-8 transition hover:border-primary"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <Upload className="h-8 w-8 text-foreground/40" />
        <p className="mt-2 text-sm text-foreground/60">
          {uploading ? "Uploading..." : "Click to upload image (max 5MB)"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {existingImages.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden border border-border">
              <Image src={img.url} alt={img.altText ?? img.originalName} fill className="object-cover" />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(img.id)}
                  className="absolute right-1 top-1 bg-red-600 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaUploaderPanel() {
  const [uploaded, setUploaded] = useState<UploadedMedia[]>([]);

  return (
    <div>
      <ImageUploader
        onUploaded={(media) => setUploaded((prev) => [...prev, media])}
        existingImages={uploaded}
      />
      {uploaded.length > 0 && (
        <p className="mt-2 text-xs text-green-700">{uploaded.length} file(s) uploaded successfully.</p>
      )}
    </div>
  );
}
