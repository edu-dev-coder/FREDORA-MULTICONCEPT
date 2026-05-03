import { useListProducts, useGetHomepage } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ShoppingBag, Tag, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductsSectionProps {
  divisionSlug: string;
}

const accentColors = [
  "from-blue-600 to-blue-800",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-700",
  "from-rose-500 to-red-700",
  "from-cyan-500 to-blue-700",
];

export function ProductsSection({ divisionSlug }: ProductsSectionProps) {
  const { data: products } = useListProducts({ divisionSlug });
  const { data: homepage } = useGetHomepage();

  if (!products || products.length === 0) return null;

  const getUrl = (raw: string) =>
    raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;

  const buildWhatsAppUrl = (productName: string) => {
    const number = homepage?.whatsappNumber?.replace(/\D/g, "");
    if (!number) return "/contact";
    const text = encodeURIComponent(`Hi Fredora, I'd like to order: ${productName}`);
    return `https://wa.me/${number}?text=${text}`;
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-100/60 blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-100/60 blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-5">
            Catalog
          </span>
          <h2 className="text-3xl font-serif font-bold text-foreground">Products & Catalog</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => {
            const waUrl = buildWhatsAppUrl(product.name);
            const isWhatsApp = waUrl.startsWith("https://wa.me");

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl flex flex-col">
                  {product.imageUrl ? (
                    <div className="aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={getUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-400"
                      />
                    </div>
                  ) : (
                    <div className={`aspect-square bg-gradient-to-br ${accentColors[i % accentColors.length]} flex items-center justify-center`}>
                      <ShoppingBag className="h-14 w-14 text-white/40" />
                    </div>
                  )}
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-foreground mb-1 leading-snug">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-3">
                      {product.price ? (
                        <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
                          <Tag className="h-3.5 w-3.5" />
                          {product.price}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Contact for price</span>
                      )}
                      <a
                        href={waUrl}
                        target={isWhatsApp ? "_blank" : undefined}
                        rel={isWhatsApp ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-sm transition-all shrink-0"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Order
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
