import { useQuery } from "@tanstack/react-query";
import { useListDivisions, useListProducts } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Printer, ShoppingBag, Tag } from "lucide-react";
import { useSEO } from "@/lib/seo";

interface Product {
  id: number;
  divisionSlug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: string | null;
}

function DivisionCatalogue({ slug, name }: { slug: string; name: string }) {
  const { data: products } = useListProducts({ divisionSlug: slug });

  if (!products || products.length === 0) return null;

  const getUrl = (raw: string) =>
    raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;

  return (
    <div className="mb-12 break-inside-avoid-page">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary/20">
        <div className="w-2 h-8 rounded-full bg-primary" />
        <h2 className="text-2xl font-bold font-serif text-foreground">{name}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-xl overflow-hidden bg-white break-inside-avoid">
            {product.imageUrl ? (
              <div className="aspect-square overflow-hidden bg-slate-50">
                <img src={getUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-emerald-300" />
              </div>
            )}
            <div className="p-3">
              <h3 className="font-semibold text-sm text-foreground mb-1 leading-snug">{product.name}</h3>
              {product.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
              )}
              {product.price && (
                <div className="flex items-center gap-1 text-xs font-bold text-primary">
                  <Tag className="h-3 w-3" />
                  {product.price}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Catalogue() {
  const { data: divisions } = useListDivisions();
  const { data: homepage } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const res = await fetch("/api/homepage");
      return res.json();
    },
  });

  useSEO({
    title: "Product Catalogue — Fredora Multiconcept",
    description: "Browse the full product catalogue of Fredora Multiconcept — Foods, EduServices, Chems, Scents, Transport & Logistics.",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Screen-only nav */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1">
        {/* Screen-only header */}
        <section className="print:hidden py-16 bg-gradient-to-br from-emerald-900 to-teal-800 overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", backgroundSize: "36px 36px" }} />
          <div className="container relative z-10 text-center text-white px-4">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-5 py-2 mb-6 text-sm font-medium">
              <ShoppingBag className="h-4 w-4 text-amber-300" />
              Full Product Range
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold font-serif mb-4">
              Product Catalogue
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Browse our full range of products across all Fredora divisions. Print or save as PDF.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex gap-4 justify-center">
              <Button onClick={handlePrint} size="lg" className="rounded-full bg-white text-emerald-900 hover:bg-white/90 font-semibold px-8 gap-2">
                <Printer className="h-5 w-5" />
                Print / Save PDF
              </Button>
              <Button onClick={handlePrint} size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10 px-8 gap-2">
                <Download className="h-5 w-5" />
                Download PDF
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Catalogue Content (prints nicely) */}
        <section className="py-12 print:py-4">
          <div className="container mx-auto px-4 md:px-6">
            {/* Print header */}
            <div className="hidden print:block mb-10 text-center border-b-2 border-primary pb-6">
              <h1 className="text-3xl font-bold font-serif text-foreground mb-1">Fredora Multiconcept</h1>
              <p className="text-muted-foreground text-sm">Product Catalogue — {new Date().getFullYear()}</p>
              {homepage?.whatsappNumber && (
                <p className="text-sm mt-1">WhatsApp: {homepage.whatsappNumber}</p>
              )}
            </div>

            {!divisions || divisions.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No products available yet.</p>
              </div>
            ) : (
              divisions.map((div) => (
                <DivisionCatalogue key={div.slug} slug={div.slug} name={div.name} />
              ))
            )}

            {/* Print footer */}
            <div className="hidden print:block mt-10 pt-4 border-t text-center text-xs text-muted-foreground">
              <p>Fredora Multiconcept — Giving you the best of your needs.</p>
              <p>Contact us for pricing, bulk orders, and custom requirements.</p>
            </div>

            {/* Screen print button bottom */}
            <div className="print:hidden mt-10 text-center">
              <Button onClick={handlePrint} size="lg" className="rounded-full px-10 gap-2 shadow-lg shadow-primary/20">
                <Printer className="h-5 w-5" />
                Print / Save as PDF
              </Button>
            </div>
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
