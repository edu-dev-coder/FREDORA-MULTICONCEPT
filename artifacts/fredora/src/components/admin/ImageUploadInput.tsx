import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";

interface ImageUploadInputProps {
  currentImageUrl: string | null | undefined;
  onUploadComplete: (objectPath: string) => void;
  label?: string;
  maxSizeMB?: number;
  recommendedSize?: string;
}

export function ImageUploadInput({
  currentImageUrl,
  onUploadComplete,
  label = "Banner Image",
  maxSizeMB = 10,
  recommendedSize,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = previewUrl || currentImageUrl;
  const maxBytes = maxSizeMB * 1024 * 1024;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP, etc.)");
      return;
    }

    if (file.size > maxBytes) {
      setError(`Image must be under ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setIsUploading(true);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      // 1. First priority: Upload directly to Supabase Storage (permanent cloud CDN)
      let publicImageUrl: string | null = null;
      try {
        const { uploadToSupabase } = await import("@/lib/supabase");
        publicImageUrl = await uploadToSupabase(file);
      } catch (supabaseErr) {
        console.warn("Supabase upload attempted, falling back to local storage handler:", supabaseErr);
      }

      if (publicImageUrl) {
        onUploadComplete(publicImageUrl);
        return;
      }

      // 2. Secondary fallback: Use standard backend storage endpoint
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });

      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await urlRes.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");

      onUploadComplete(objectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="block text-sm font-medium leading-none">{label}</label>
        <span className="text-xs text-muted-foreground shrink-0">
          JPG · PNG · WebP · max {maxSizeMB}MB
          {recommendedSize && ` · recommended ${recommendedSize}`}
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted/30 group">
        {displayUrl ? (
          <div className="relative h-48">
            <img
              src={displayUrl.startsWith("/objects/") ? `/api/storage${displayUrl}` : displayUrl}
              alt="Uploaded image"
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl(null)}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <ImageIcon className="h-9 w-9 opacity-50" />
            <p className="text-sm">No image set</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-white flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {displayUrl && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Replace Image
        </Button>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="h-4 w-4" /> {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
