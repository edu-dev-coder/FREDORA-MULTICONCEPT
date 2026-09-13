import { Link } from "wouter";
import { useEffect, useState, useCallback } from "react";
import { useGetHomepage, useListDivisions, useListHeroSlides } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronRight, Star, TrendingUp, Users, Award, ArrowRight } from "lucide-react";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { useSEO } from "@/lib/seo";

function HeroSlideshow({ slides, fallbackUrl }: { slides: { id: number; imageUrl: string }[]; fallbackUrl: string }) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((i: number) => setCurrent(i), []);

  const safeSlides = Array.isArray(slides) ? slides : [];

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % safeSlides.length), 5000);
    return () => clearInterval(id);
  }, [safeSlides.length]);

  const images = safeSlides.length > 0 ? safeSlides : [{ id: 0, imageUrl: fallbackUrl }];
  const all = images.length > 0 ? images : [{ id: 0, imageUrl: "/images/hero-bg.png" }];

  return (
    <>
      {all.map((slide, i) => {
        const url = slide.imageUrl.startsWith("/objects/")
          ? `/api/storage${slide.imageUrl}`
          : slide.imageUrl;
        return (
          <div
            key={slide.id}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${url}')`,
              opacity: i === current ? 1 : 0,
            }}
          />
        );
      })}
      {all.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {all.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 border-2 border-white/60 ${i === current ? "bg-white w-8 scale-100" : "bg-white/30 w-2.5"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

const divisionColors = [
  "from-blue-600 to-blue-800",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-700",
  "from-rose-500 to-red-700",
  "from-cyan-500 to-blue-700",
];

export default function Home() {
  const { data: homepage, isLoading: homeLoading } = useGetHomepage();
  const { data: divisions, isLoading: divLoading } = useListDivisions();
  const { data: heroSlides = [] } = useListHeroSlides();

  const _homeDesc = homepage?.metaDescription
    ?? (homepage?.heroSubtitle ?? "Fredora Multiconcept — a Nigerian multi-division company in Foods, EduServices, Chems, Scents, and Transport & Logistics, based in Enugu.");
  const _homeSameAs = [
    homepage?.facebookUrl,
    homepage?.instagramUrl,
    homepage?.twitterUrl,
    homepage?.linkedinUrl,
    homepage?.youtubeUrl,
  ].filter(Boolean) as string[];
  useSEO({
    title: "Fredora Multiconcept",
    description: _homeDesc,
    imageUrl: homepage?.heroImageUrl,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness"],
        "name": "Fredora Multiconcept",
        "url": window.location.origin,
        "logo": { "@type": "ImageObject", "url": `${window.location.origin}/favicon.svg` },
        "description": _homeDesc,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Enugu",
          "addressRegion": "Enugu State",
          "addressCountry": "NG",
        },
        "areaServed": "Nigeria",
        "sameAs": _homeSameAs,
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "English",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Fredora Multiconcept",
        "url": window.location.origin,
      },
    ],
  });

  if (homeLoading || divLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-primary font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  const fallbackUrl = homepage?.heroImageUrl
    ? (homepage.heroImageUrl.startsWith("/objects/") ? `/api/storage${homepage.heroImageUrl}` : homepage.heroImageUrl)
    : "/images/hero-bg.png";

  const statIcons = [TrendingUp, Users, Star, Award];
  const statColors = ["text-blue-600", "text-amber-600", "text-violet-600", "text-rose-600"];
  const hp = homepage as any;
  const rawStats = Array.isArray(hp?.stats) && hp.stats.length > 0
    ? hp.stats
    : [
        { label: "Divisions", value: "5+" },
        { label: "Happy Clients", value: "500+" },
        { label: "Years of Excellence", value: "10+" },
        { label: "Awards Won", value: "20+" },
      ];
  const stats = rawStats.map((stat: any, i: number) => ({
    ...stat,
    icon: statIcons[i % statIcons.length],
    color: statColors[i % statColors.length],
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[500px] sm:min-h-[580px] md:h-[88vh] md:min-h-[620px] flex items-center justify-center overflow-hidden py-16 sm:py-20 md:py-0">
          <HeroSlideshow slides={heroSlides} fallbackUrl={fallbackUrl} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 z-10" />
          
          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl z-10 pointer-events-none" />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl z-10 pointer-events-none" />
          
          <div className="container relative z-20 text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8 text-xs sm:text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Nigeria's Premier Multiconcept Corporation
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif mb-4 sm:mb-6 leading-tight max-w-4xl mx-auto"
            >
              {homepage?.heroTitle || "Fredora Multiconcept"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-base sm:text-xl md:text-2xl font-light italic text-amber-200 mb-8 sm:mb-10 max-w-2xl mx-auto"
            >
              {homepage?.motto || "Giving you the best of your needs."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto"
            >
              <Button asChild size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-13 rounded-full shadow-lg shadow-amber-500/30 font-semibold">
                <Link href="/about">Discover Our Story</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-13 rounded-full">
                <Link href="/contact">Get in Touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="relative -mt-1 bg-white/90 backdrop-blur-sm border-b shadow-md z-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-x">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex flex-col items-center py-5 sm:py-6 px-3 sm:px-4 text-center"
                >
                  <stat.icon className={`h-5 sm:h-6 w-5 sm:w-6 ${stat.color} mb-1.5 sm:mb-2`} />
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 via-slate-50 to-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-100/60 blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 leading-tight">
                A Nigerian Conglomerate<br />Rooted in Excellence
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {homepage?.heroSubtitle || "We are a diverse group of companies dedicated to providing premium quality products and services across various sectors, improving lives and communities across Nigeria and beyond."}
              </p>
              <div className="mt-8">
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8">
                  <Link href="/about">Learn More About Us <ChevronRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Divisions Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
                Our Portfolio
              </span>
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Divisions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Explore our diverse portfolio of businesses, each committed to delivering the highest standards in their respective industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(divisions) && divisions.map((div, index) => (
                <motion.div
                  key={div.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={div.slug === "temperamap" ? "/temperamap" : `/divisions/${div.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-400 border border-border hover:-translate-y-1 bg-white/85 backdrop-blur-sm group cursor-pointer">
                      <div className="h-52 overflow-hidden relative">
                        {div.imageUrl ? (
                          <img
                            src={div.imageUrl.startsWith("/objects/") ? `/api/storage${div.imageUrl}` : div.imageUrl}
                            alt={div.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${divisionColors[index % divisionColors.length]}`} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        {div.comingSoon && (
                          <span className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                            Coming Soon
                          </span>
                        )}
                        <h3 className="absolute bottom-4 left-5 right-5 text-xl font-bold text-white font-serif leading-tight">{div.name}</h3>
                      </div>
                      <CardContent className="pt-5 pb-6">
                        <p className="text-muted-foreground line-clamp-2 mb-5 text-sm leading-relaxed">
                          {div.description}
                        </p>
                        <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                          Explore Division <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission / Vision Section */}
        <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(152, 68%, 22%) 0%, hsl(152, 68%, 30%) 50%, hsl(175, 60%, 28%) 100%)' }}>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)', backgroundSize: '36px 36px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-300 bg-white/10 px-4 py-1.5 rounded-full mb-6">
                Our Purpose
              </span>
              <h2 className="text-4xl font-serif font-bold text-white">Mission & Vision</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-amber-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3 sm:mb-4">Our Mission</h3>
                <p className="text-base sm:text-lg leading-relaxed text-white/85">
                  {homepage?.missionStatement || "To consistently deliver high-quality products and services that meet the diverse needs of our customers while contributing positively to the communities we serve."}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-400/20 flex items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-blue-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3 sm:mb-4">Our Vision</h3>
                <p className="text-base sm:text-lg leading-relaxed text-white/85">
                  {homepage?.visionStatement || "To be the leading and most trusted multiconcept corporation in Nigeria and beyond, known for excellence, innovation, and integrity."}
                </p>
              </motion.div>
            </div>

            {homepage?.coreValues && homepage.coreValues.length > 0 && (
              <div className="mt-20">
                <h2 className="text-2xl font-serif font-bold text-center text-white mb-12">Core Values</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {homepage.coreValues.map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-400/25 flex items-center justify-center mb-3">
                        <Star className="h-5 w-5 text-amber-300" />
                      </div>
                      <h4 className="font-semibold text-base text-white">{value}</h4>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-y">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                {hp?.ctaBannerTitle || "Ready to Work With Us?"}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {hp?.ctaBannerText || "Whether you want to place an order, ask about our services, or explore a partnership — we're here for you."}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-white">
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <TestimonialsSection />

        {/* Social Media Section */}
        {(homepage?.facebookUrl || homepage?.instagramUrl || homepage?.twitterUrl || homepage?.linkedinUrl || homepage?.youtubeUrl) && (
          <section className="py-16 bg-gradient-to-br from-slate-900 via-[#001020] to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-300 bg-white/10 px-4 py-1.5 rounded-full mb-6">
                  Follow Us Online
                </span>
                <h2 className="text-3xl font-serif font-bold text-white mb-3">Stay Connected</h2>
                <p className="text-white/60 mb-10 max-w-md mx-auto">Follow Fredora Multiconcept on social media for the latest updates, product launches, and news.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {homepage?.facebookUrl && (
                    <a href={homepage.facebookUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 bg-[#1877F2] hover:bg-[#0d65d9] text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-900/30">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                  )}
                  {homepage?.instagramUrl && (
                    <a href={homepage.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-pink-900/30">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      Instagram
                    </a>
                  )}
                  {homepage?.twitterUrl && (
                    <a href={homepage.twitterUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 bg-black hover:bg-zinc-800 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-black/30">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                      X (Twitter)
                    </a>
                  )}
                  {homepage?.linkedinUrl && (
                    <a href={homepage.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 bg-[#0A66C2] hover:bg-[#0952a5] text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-900/30">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                  )}
                  {homepage?.youtubeUrl && (
                    <a href={homepage.youtubeUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 bg-[#FF0000] hover:bg-[#cc0000] text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-red-900/30">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      YouTube
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        )}

      </main>
      
      <Footer />
    </div>
  );
}
