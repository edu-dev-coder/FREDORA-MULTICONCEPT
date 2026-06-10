import { useParams } from "wouter";
import { useGetDivision, getGetDivisionQueryKey, useGetHomepage } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Phone, MessageCircle, ShoppingCart, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GallerySection } from "@/components/sections/GallerySection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { Link } from "wouter";
import { useSEO } from "@/lib/seo";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const divisionAccents: Record<string, string> = {
  foods: "from-blue-600 to-blue-800",
  eduservices: "from-sky-500 to-blue-700",
  chems: "from-violet-500 to-purple-700",
  scents: "from-rose-500 to-pink-700",
  transport: "from-amber-500 to-orange-600",
  temperamap: "from-[#1B3A6B] to-[#0a2a5e]",
};

export default function DivisionDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const { data: division, isLoading } = useGetDivision(slug, { query: { enabled: !!slug, queryKey: getGetDivisionQueryKey(slug) } });
  const { data: homepage } = useGetHomepage();
  const { addItem, openCart } = useCart();
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const handleAddToCart = (service: { id: number; name: string; price?: string | null; imageUrl?: string | null }) => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price ?? null,
      imageUrl: service.imageUrl ?? null,
      divisionSlug: slug,
      divisionName: division?.name ?? slug,
    });
    setAddedIds((prev) => new Set(prev).add(service.id));
    setTimeout(() => setAddedIds((prev) => { const next = new Set(prev); next.delete(service.id); return next; }), 2000);
    openCart();
  };

  const buildServiceWhatsAppUrl = (serviceName: string) => {
    const number = homepage?.whatsappNumber?.replace(/\D/g, "");
    if (!number) return "/contact";
    const text = encodeURIComponent(`Hi Fredora, I'd like to enquire about: ${serviceName}`);
    return `https://wa.me/${number}?text=${text}`;
  };

  const _divDesc = division
    ? `${division.tagline ? division.tagline + " — " : ""}${division.description.slice(0, 155)}…`
    : "Explore Fredora Multiconcept's divisions — Foods, EduServices, Chems, Scents, and Transport & Logistics.";
  useSEO({
    title: division ? division.name : "Division",
    description: _divDesc,
    imageUrl: division?.imageUrl,
    structuredData: division
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin + "/" },
              { "@type": "ListItem", "position": 2, "name": "Divisions", "item": window.location.origin + "/divisions/" },
              { "@type": "ListItem", "position": 3, "name": division.name, "item": `${window.location.origin}/divisions/${slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": division.name,
            "description": division.description,
            "serviceType": division.name,
            "provider": { "@type": "Organization", "name": "Fredora Multiconcept", "url": window.location.origin },
            "areaServed": { "@type": "Country", "name": "Nigeria" },
            "url": `${window.location.origin}/divisions/${slug}`,
          },
        ]
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-primary font-medium">Loading division…</p>
        </div>
      </div>
    );
  }

  if (!division) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-muted-foreground">
        Division not found.
      </div>
    );
  }

  const defaultBgImageMap: Record<string, string> = {
    foods: "/images/foods-banner.png",
    eduservices: "/images/eduservices-banner.png",
    chems: "/images/chems-banner.png",
    scents: "/images/scents-banner.png",
    transport: "/images/transport-banner.png",
  };

  const rawImageUrl = division.imageUrl;
  const bgImage = rawImageUrl
    ? rawImageUrl.startsWith("/objects/") ? `/api/storage${rawImageUrl}` : rawImageUrl
    : defaultBgImageMap[slug] || "/images/hero-bg.png";

  const accent = divisionAccents[slug] || "from-emerald-500 to-teal-600";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${bgImage}')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
          {/* Colorful bottom accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${accent}`} />

          <div className="container relative z-20 text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-xs font-bold tracking-widest uppercase text-white/70 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full mb-5 border border-white/15"
            >
              Fredora Division
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold font-serif mb-4 leading-tight"
            >
              {division.name}
            </motion.h1>
            {division.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl md:text-2xl font-light text-amber-200"
              >
                {division.tagline}
              </motion.p>
            )}
          </div>
        </section>

        {/* About section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">

              {division.comingSoon && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-10 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl flex items-start gap-4 shadow-sm"
                >
                  <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Coming Soon</h3>
                    <p className="text-muted-foreground">This division is currently under development. Stay tuned for our launch.</p>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-sm border mb-10"
              >
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${accent} text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 shadow-sm`}>
                  About This Division
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line mb-8">
                  {division.description}
                </p>
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button asChild className="rounded-full px-6 shadow-sm shadow-primary/20">
                    <Link href="/contact">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Request a Quote
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full px-6 border-primary text-primary hover:bg-primary hover:text-white">
                    <Link href="/contact">
                      <Phone className="mr-2 h-4 w-4" />
                      Pay / Order
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {division.services && division.services.length > 0 && (
                <div>
                  <div className="text-center mb-10">
                    <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                      Our Offerings
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-foreground">Products & Services</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {division.services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 rounded-2xl group">
                          <div className="h-44 overflow-hidden relative">
                            {service.imageUrl ? (
                              <img
                                src={service.imageUrl.startsWith("/objects/") ? `/api/storage${service.imageUrl}` : service.imageUrl}
                                alt={service.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-80`}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <CheckCircle2 className="h-14 w-14 text-white/30" />
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-base leading-tight drop-shadow">
                              {service.name}
                            </h3>
                          </div>
                          <CardContent className="p-4">
                            {service.description && (
                              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{service.description}</p>
                            )}
                            {service.price && (
                              <p className="text-sm font-semibold text-foreground mb-3">{service.price}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleAddToCart(service)}
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                                  addedIds.has(service.id)
                                    ? "bg-green-600 text-white"
                                    : "bg-[#001847] hover:bg-[#0d3a8e] text-white"
                                }`}
                              >
                                {addedIds.has(service.id) ? (
                                  <><Check className="h-3.5 w-3.5" /> Added!</>
                                ) : (
                                  <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>
                                )}
                              </button>
                              {(() => {
                                const waUrl = buildServiceWhatsAppUrl(service.name);
                                const isWa = waUrl.startsWith("https://wa.me");
                                return (
                                  <a
                                    href={waUrl}
                                    target={isWa ? "_blank" : undefined}
                                    rel={isWa ? "noopener noreferrer" : undefined}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-all"
                                  >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    Enquire
                                  </a>
                                );
                              })()}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <ProductsSection divisionSlug={slug} />
        <GallerySection divisionSlug={slug} />
      </main>

      <Footer />
    </div>
  );
}
