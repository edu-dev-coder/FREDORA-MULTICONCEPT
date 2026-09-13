// Supabase Configuration
// Supports environment variables with fallback to project credentials
export const SUPABASE_URL = 
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://mzhfenzuxrnwocfpolgq.supabase.co";

export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16aGZlbnp1eHJud29jZnBvbGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDIxMTYsImV4cCI6MjEwNDg3ODExNn0.HBHpbaQn3Y-PSJ1LqAqcGLtPa_zWyfOWf5r1da7J03c";

export const SUPABASE_STORAGE_BUCKET = "uploads";

/**
 * Uploads a file directly to Supabase Storage REST API.
 * This runs natively in any browser without needing heavy external SDKs.
 * Returns the permanent, public CDN URL of the uploaded image.
 */
export async function uploadToSupabase(file: File, folder = "images"): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${folder}/${Date.now()}_${cleanName}`;
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${SUPABASE_STORAGE_BUCKET}/${fileName}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": file.type || "image/jpeg",
      "x-upsert": "true",
    },
    body: file,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || `Upload failed with status ${res.status}`);
  }

  // Return the public URL for the uploaded asset
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${fileName}`;
}
