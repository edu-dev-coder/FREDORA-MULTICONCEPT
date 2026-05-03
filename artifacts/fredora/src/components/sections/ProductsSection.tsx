import { useListProducts } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface ProductsSectionProps {
  divisionSlug: string;
}

const accentColors = [
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-700",
  "from-rose-500 to-red-700",
  "from-lime-500 to-green-600",
];

export function ProductsSection({ divisionSlug }: ProductsSectionProps) {
  const { data: products } = useListProducts({ divisionSlug });

  if (!products || products.length === 0) return null;

  const getUrl = (raw: string) =>
    raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-100/60 blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-100/60 blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-5">
            Catalog
          </span>
          <h2 className="text-3xl font-serif font-bold text-foreground">Products & Catalog</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl">
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
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-1 leading-snug">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    {product.price ? (
                      <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
                        <Tag className="h-3.5 w-3.5" />
                        {product.price}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Contact for price</span>
                    )}
                    <Button asChild size="sm" className="rounded-full text-xs px-4 shadow-sm shadow-primary/20 shrink-0">
                      <Link href="/contact">
                        Buy Now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
