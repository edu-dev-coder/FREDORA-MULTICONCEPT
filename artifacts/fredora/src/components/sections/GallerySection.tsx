import { useListGalleryItems } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

interface GallerySectionProps {
  divisionSlug: string;
}

export function GallerySection({ divisionSlug }: GallerySectionProps) {
  const { data: items } = useListGalleryItems({ divisionSlug });
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!items || items.length === 0) return null;

  const getUrl = (raw: string) =>
    raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-serif font-bold text-primary mb-8 text-center">Gallery</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLightbox(getUrl(item.imageUrl))}
              className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
            >
              <img
                src={getUrl(item.imageUrl)}
                alt={item.caption || "Gallery image"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {item.caption && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-sm font-medium">{item.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-slate-300"
            onClick={() => setLightbox(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={lightbox}
            alt="Gallery preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
