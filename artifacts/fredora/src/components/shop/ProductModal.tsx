import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useGetHomepage } from "@workspace/api-client-react";
import {
  ShoppingCart, Plus, Minus, MessageCircle, Tag, Package, X,
} from "lucide-react";
import { motion } from "framer-motion";

export interface ShopProduct {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: string | null;
  divisionSlug: string;
  divisionName: string;
}

interface ProductModalProps {
  product: ShopProduct | null;
  onClose: () => void;
}

function getImageUrl(raw: string | null | undefined) {
  if (!raw) return null;
  return raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;
}

const divisionColors: Record<string, string> = {
  foods: "bg-blue-100 text-blue-700",
  eduservices: "bg-sky-100 text-sky-700",
  chems: "bg-violet-100 text-violet-700",
  scents: "bg-pink-100 text-pink-700",
  transport: "bg-amber-100 text-amber-700",
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const { data: homepage } = useGetHomepage();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const imageUrl = getImageUrl(product.imageUrl);
  const divColor = divisionColors[product.divisionSlug] ?? "bg-slate-100 text-slate-700";
  const whatsappNumber = homepage?.whatsappNumber?.replace(/\D/g, "") ?? "";

  function handleAdd() {
    addItem({
      id: product!.id,
      name: product!.name,
      price: product!.price ?? null,
      imageUrl: product!.imageUrl ?? null,
      divisionSlug: product!.divisionSlug,
      divisionName: product!.divisionName,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWhatsApp() {
    if (!whatsappNumber) return;
    const text = `Hello Fredora! I'm interested in: *${product!.name}*${product!.price ? ` (${product!.price})` : ""} from ${product!.divisionName}. Please share more details.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <Dialog open={!!product} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Image panel */}
          <div className="md:w-1/2 bg-muted/30 relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-72 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-72 md:h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 min-h-[280px]">
                <Package className="h-20 w-20 text-slate-300" />
              </div>
            )}
          </div>

          {/* Details panel */}
          <div className="md:w-1/2 p-6 flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Division badge */}
            <Badge className={`w-fit text-xs mb-3 ${divColor} border-0`}>
              {product.divisionName}
            </Badge>

            <h2 className="text-2xl font-bold font-serif text-foreground leading-tight mb-3">
              {product.name}
            </h2>

            {product.price && (
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-primary">{product.price}</span>
              </div>
            )}

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                {product.description}
              </p>
            )}

            {!product.description && <div className="flex-1" />}

            {/* Quantity */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-bold w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handleAdd}
                  className="w-full rounded-full gap-2 py-5"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {added ? "Added to Cart! ✓" : "Add to Cart"}
                </Button>
              </motion.div>
              {whatsappNumber && (
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="w-full rounded-full gap-2 py-5 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Enquire on WhatsApp
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
