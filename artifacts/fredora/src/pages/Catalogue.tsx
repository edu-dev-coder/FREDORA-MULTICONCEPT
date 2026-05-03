import { useListDivisions, useListProducts, useGetHomepage } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Download, Printer, ShoppingBag, Tag, Wrench, Info } from "lucide-react";
import { useSEO } from "@/lib/seo";
import type { Division } from "@workspace/api-client-react";

function getUrl(raw: string) {
  return raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;
}

const divisionAccentColors: Record<string, string> = {
  foods: "#1565C0",
  eduservices: "#0277bd",
  chems: "#6a1b9a",
  scents: "#ad1457",
  transport: "#e65100",
};

function DivisionCatalogueSection({ division }: { division: Division }) {
  const { data: products } = useListProducts({ divisionSlug: division.slug });
  const services = division.services ?? [];
  const hasProducts = products && products.length > 0;
  const hasServices = services.length > 0;

  if (!hasProducts && !hasServices) return null;

  const accent = divisionAccentColors[division.slug] ?? "#1565C0";

  return (
    <div className="mb-16 break-inside-avoid-page">
      {/* Division header */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b-2" style={{ borderColor: accent + "33" }}>
        <div className="w-3 h-10 rounded-full shrink-0" style={{ background: accent }} />
        <div>
          <h2 className="text-2xl font-bold font-serif" style={{ color: accent }}>{division.name}</h2>
          {division.tagline && (
            <p className="text-sm text-muted-foreground mt-0.5">{division.tagline}</p>
          )}
        </div>
        <div className="ml-auto flex gap-2 print:hidden">
          {hasProducts && (
            <Badge variant="secondary" className="text-xs">{products!.length} product{products!.length !== 1 ? "s" : ""}</Badge>
          )}
          {hasServices && (
            <Badge variant="outline" className="text-xs">{services.length} service{services.length !== 1 ? "s" : ""}</Badge>
          )}
        </div>
      </div>

      {/* Products */}
      {hasProducts && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Products</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products!.map((product) => (
              <div key={product.id} className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow break-inside-avoid">
                {product.imageUrl ? (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center" style={{ background: accent + "12" }}>
                    <ShoppingBag className="h-10 w-10 opacity-30" style={{ color: accent }} />
                  </div>
                )}
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-foreground mb-1 leading-snug">{product.name}</h4>
                  {product.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  )}
                  {product.price && (
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: accent }}>
                      <Tag className="h-3 w-3" />
                      {product.price}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {hasServices && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Services</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start break-inside-avoid"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: accent + "18" }}
                >
                  <Wrench className="h-5 w-5" style={{ color: accent }} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">{service.name}</h4>
                  {service.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Catalogue() {
  const { data: divisions, isLoading } = useListDivisions();
  const { data: homepage } = useGetHomepage();

  useSEO({
    title: "Products & Services Catalogue — Fredora Multiconcept",
    description: "Browse the full products and services catalogue of Fredora Multiconcept — Foods, EduServices, Chems, Scents, Transport & Logistics.",
  });

  const handlePrint = () => window.print();

  const activeDivisions = divisions?.filter((d) => !d.comingSoon) ?? [];
  const totalProducts = 0; // counted per division in component
  const totalServices = divisions?.reduce((sum, d) => sum + (d.services?.length ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Screen-only nav */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1">
        {/* Hero header — screen only */}
        <section className="print:hidden py-20 bg-gradient-to-br from-[#001847] to-[#1565C0] overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", backgroundSize: "36px 36px" }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="container relative z-10 text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-5 py-2 mb-6 text-sm font-medium"
            >
              <ShoppingBag className="h-4 w-4 text-amber-300" />
              Full Products & Services
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold font-serif mb-4"
            >
              Our Catalogue
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/80 max-w-2xl mx-auto mb-3"
            >
              Browse every product and service offered across all Fredora Multiconcept divisions.
            </motion.p>
            {activeDivisions.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-white/60 mb-8"
              >
                {activeDivisions.length} divisions · {totalServices} services
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button
                onClick={handlePrint}
                size="lg"
                className="rounded-full bg-white text-[#001847] hover:bg-white/90 font-semibold px-8 gap-2 shadow-lg"
              >
                <Printer className="h-5 w-5" />
                Print / Save as PDF
              </Button>
              <Button
                onClick={handlePrint}
                size="lg"
                variant="outline"
                className="rounded-full border-white/50 text-white hover:bg-white/10 px-8 gap-2"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Catalogue Notes banner — if set by admin */}
        {homepage?.catalogueNotes && (
          <div className="print:hidden bg-amber-50 border-b border-amber-200">
            <div className="container mx-auto px-4 md:px-6 py-3 flex items-start gap-3">
              <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800 leading-relaxed">{homepage.catalogueNotes}</p>
            </div>
          </div>
        )}

        {/* Catalogue Content */}
        <section className="py-12 print:py-4 bg-gradient-to-br from-slate-50 to-white min-h-[40vh]">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">

            {/* Print cover */}
            <div className="hidden print:block mb-12 text-center border-b-2 border-primary pb-8">
              <img src="/images/logo.png" alt="Fredora Multiconcept" className="h-16 w-auto mx-auto mb-4" />
              <h1 className="text-4xl font-bold font-serif text-foreground mb-2">Fredora Multiconcept</h1>
              <p className="text-lg text-muted-foreground mb-1">Products & Services Catalogue — {new Date().getFullYear()}</p>
              {homepage?.whatsappNumber && (
                <p className="text-sm text-muted-foreground">WhatsApp: {homepage.whatsappNumber}</p>
              )}
              {homepage?.catalogueNotes && (
                <p className="text-sm mt-3 italic text-muted-foreground">{homepage.catalogueNotes}</p>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-muted-foreground">Loading catalogue…</p>
              </div>
            ) : activeDivisions.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No catalogue items yet</p>
                <p className="text-sm mt-1">Products and services will appear here once added by the admin.</p>
              </div>
            ) : (
              activeDivisions.map((division, i) => (
                <motion.div
                  key={division.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <DivisionCatalogueSection division={division} />
                </motion.div>
              ))
            )}

            {/* Print footer */}
            <div className="hidden print:block mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
              <p className="font-medium">Fredora Multiconcept — Giving you the best of your needs.</p>
              <p className="mt-1">Contact us for pricing, bulk orders, and custom requirements.</p>
            </div>

            {/* Bottom print button */}
            {activeDivisions.length > 0 && (
              <div className="print:hidden mt-12 text-center">
                <Button
                  onClick={handlePrint}
                  size="lg"
                  className="rounded-full px-12 gap-2 shadow-lg shadow-primary/20"
                >
                  <Printer className="h-5 w-5" />
                  Print / Save as PDF
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
