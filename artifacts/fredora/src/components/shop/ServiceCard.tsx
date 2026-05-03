import { MessageCircle, Wrench } from "lucide-react";
import { useGetHomepage } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface ShopService {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  divisionSlug: string;
  divisionName: string;
}

function getImageUrl(raw: string | null | undefined) {
  if (!raw) return null;
  return raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;
}

const divisionGradients: Record<string, string> = {
  foods: "from-blue-600 to-blue-800",
  eduservices: "from-sky-500 to-blue-700",
  chems: "from-violet-500 to-purple-700",
  scents: "from-rose-500 to-pink-700",
  transport: "from-amber-500 to-orange-600",
  temperamap: "from-[#1B3A6B] to-[#0a2a5e]",
};

const divisionColors: Record<string, string> = {
  foods: "bg-blue-100 text-blue-700",
  eduservices: "bg-sky-100 text-sky-700",
  chems: "bg-violet-100 text-violet-700",
  scents: "bg-pink-100 text-pink-700",
  transport: "bg-amber-100 text-amber-700",
  temperamap: "bg-indigo-100 text-indigo-800",
};

export function ServiceCard({ service }: { service: ShopService }) {
  const { data: homepage } = useGetHomepage();
  const whatsappNumber = homepage?.whatsappNumber?.replace(/\D/g, "") ?? "";
  const imageUrl = getImageUrl(service.imageUrl);
  const gradient = divisionGradients[service.divisionSlug] ?? "from-slate-500 to-slate-700";
  const divColor = divisionColors[service.divisionSlug] ?? "bg-slate-100 text-slate-700";

  function handleEnquire(e: React.MouseEvent) {
    e.stopPropagation();
    if (!whatsappNumber) return;
    const text = `Hello Fredora Multiconcept! I'm interested in your *${service.name}* service from ${service.divisionName}. Could you please share more details?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Wrench className="h-10 w-10 text-white/25" />
          </div>
        )}

        {/* Overlay on no-image cards to show name */}
        {!imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}

        {/* Division badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`text-[10px] px-2 py-0.5 font-semibold border-0 ${divColor}`}>
            {service.divisionName}
          </Badge>
        </div>

        {/* WhatsApp overlay button on hover */}
        <div className={`absolute inset-0 bg-black/30 flex items-end justify-center pb-4 transition-opacity duration-200 ${imageUrl ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button
            onClick={handleEnquire}
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Enquire via WhatsApp
          </button>
        </div>
      </div>

      {/* Text content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
          {service.name}
        </h3>

        {service.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {service.description}
          </p>
        )}

        <button
          onClick={handleEnquire}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-[#1da851] transition-colors mt-auto"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Enquire via WhatsApp
        </button>
      </div>
    </motion.div>
  );
}
