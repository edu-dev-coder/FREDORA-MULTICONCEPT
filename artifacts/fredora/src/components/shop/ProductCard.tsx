import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Tag, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import type { ShopProduct } from "./ProductModal";

interface ProductCardProps {
  product: ShopProduct;
  onQuickView: (product: ShopProduct) => void;
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

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageUrl = getImageUrl(product.imageUrl);
  const divColor = divisionColors[product.divisionSlug] ?? "bg-slate-100 text-slate-700";

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price ?? null,
      imageUrl: product.imageUrl ?? null,
      divisionSlug: product.divisionSlug,
      divisionName: product.divisionName,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onQuickView(product)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <Package className="h-12 w-12 text-slate-200" />
          </div>
        )}

        {/* Quick view overlay */}
        <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full gap-1.5 shadow-lg text-xs font-semibold"
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </Button>
        </div>

        {/* Division badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`text-[10px] px-2 py-0.5 font-semibold border-0 ${divColor}`}>
            {product.divisionName}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          {product.price ? (
            <div className="flex items-center gap-1 text-primary font-bold text-sm">
              <Tag className="h-3.5 w-3.5" />
              {product.price}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">Price on request</span>
          )}

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
              added
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:border-primary"
            }`}
          >
            {added ? (
              <><Check className="h-3 w-3" /> Added</>
            ) : (
              <><ShoppingCart className="h-3 w-3" /> Add</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
