import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";

interface ImageUploadInputProps {
  currentImageUrl: string | null | undefined;
  onUploadComplete: (objectPath: string) => void;
  label?: string;
  maxSizeMB?: number;
  recommendedSize?: string;
  aspectRatioHint?: string;
}

export function ImageUploadInput({
  currentImageUrl,
  onUploadComplete,
  label = "Banner Image",
  maxSizeMB = 10,
  recommendedSize = "1920 × 1080 px (16:9)",
  aspectRatioHint,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = previewUrl || currentImageUrl;
  const maxBytes = maxSizeMB * 1024 * 1024;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    }
  };

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

    // Measure uploaded image dimensions
    const imgTest = new Image();
    imgTest.onload = () => {
      setDimensions({ width: imgTest.naturalWidth, height: imgTest.naturalHeight });
    };
    imgTest.src = localPreview;

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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
        <label className="block text-sm font-semibold text-foreground">{label}</label>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            📐 Recommended: {recommendedSize} {aspectRatioHint ? `(${aspectRatioHint})` : ""}
          </span>
          <span className="text-muted-foreground">Max {maxSizeMB}MB</span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted/30 group">
        {displayUrl ? (
          <div className="relative h-52 bg-slate-950/20">
            <img
              src={displayUrl.startsWith("/objects/") ? `/api/storage${displayUrl}` : displayUrl}
              alt="Uploaded image"
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={() => setPreviewUrl(null)}
            />
            {/* Measured Image Dimensions Pill */}
            {dimensions && (
              <div className="absolute top-3 left-3 z-10 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md border border-white/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Dimensions: {dimensions.width} × {dimensions.height} px</span>
              </div>
            )}
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
          <div className="h-44 flex flex-col items-center justify-center gap-2 text-muted-foreground p-4 text-center">
            <ImageIcon className="h-9 w-9 opacity-50 text-primary" />
            <p className="text-sm font-medium text-foreground">No image uploaded yet</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Target size: <span className="font-semibold text-primary">{recommendedSize}</span>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1"
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
              <span className="text-sm font-medium">Uploading & measuring image...</span>
            </div>
          </div>
        )}
      </div>

      {displayUrl && !isUploading && (
        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Replace Image
          </Button>
          {dimensions && (
            <span className="text-xs text-muted-foreground font-mono">
              Current: {dimensions.width} × {dimensions.height} px
            </span>
          )}
        </div>
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
