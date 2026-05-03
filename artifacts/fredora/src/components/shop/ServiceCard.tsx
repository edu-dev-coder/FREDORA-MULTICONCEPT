import { Wrench, MessageCircle, ArrowRight } from "lucide-react";
import { useGetHomepage } from "@workspace/api-client-react";
import { motion } from "framer-motion";

interface ShopService {
  id: number;
  name: string;
  description?: string | null;
  divisionSlug: string;
  divisionName: string;
}

const divisionAccents: Record<string, string> = {
  foods: "#1565C0",
  eduservices: "#0277bd",
  chems: "#6a1b9a",
  scents: "#ad1457",
  transport: "#e65100",
};

export function ServiceCard({ service }: { service: ShopService }) {
  const { data: homepage } = useGetHomepage();
  const whatsappNumber = homepage?.whatsappNumber?.replace(/\D/g, "") ?? "";
  const accent = divisionAccents[service.divisionSlug] ?? "#1565C0";

  function handleEnquire() {
    if (!whatsappNumber) return;
    const text = `Hello Fredora Multiconcept! I'm interested in your *${service.name}* service from ${service.divisionName}. Could you please share more details?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 p-5 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: accent + "18" }}
        >
          <Wrench className="h-5 w-5" style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug text-foreground">{service.name}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">{service.divisionName}</p>
        </div>
      </div>

      {service.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {service.description}
        </p>
      )}

      <button
        onClick={handleEnquire}
        className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-[#1da851] transition-colors"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Enquire via WhatsApp
        <ArrowRight className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
