import { useListProducts } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductsSectionProps {
  divisionSlug: string;
}

export function ProductsSection({ divisionSlug }: ProductsSectionProps) {
  const { data: products } = useListProducts({ divisionSlug });

  if (!products || products.length === 0) return null;

  const getUrl = (raw: string) =>
    raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-serif font-bold text-primary mb-8 text-center">Products & Catalog</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                {product.imageUrl ? (
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={getUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-primary/5 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-primary/30" />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  )}
                  {product.price && (
                    <p className="text-sm font-bold text-primary">{product.price}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
