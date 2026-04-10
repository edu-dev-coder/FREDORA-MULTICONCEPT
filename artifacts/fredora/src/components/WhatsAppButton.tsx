import { useGetHomepage } from "@workspace/api-client-react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const { data: homepage } = useGetHomepage();

  const number = homepage?.whatsappNumber;
  if (!number) return null;

  const clean = number.replace(/\D/g, "");
  const href = `https://wa.me/${clean}?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20Fredora%20Multiconcept.`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-2xl px-4 py-3 transition-all duration-300 hover:scale-105 group"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}
