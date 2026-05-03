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

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const images = slides.length > 0 ? slides : [{ id: 0, imageUrl: fallbackUrl }];
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
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-700",
  "from-rose-500 to-red-700",
  "from-lime-500 to-green-700",
];

export default function Home() {
  const { data: homepage, isLoading: homeLoading } = useGetHomepage();
  const { data: divisions, isLoading: divLoading } = useListDivisions();
  const { data: heroSlides = [] } = useListHeroSlides();

  useSEO({
    title: "Fredora Multiconcept",
    description: homepage?.metaDescription
      ?? (homepage?.heroSubtitle ?? "Fredora Multiconcept — a Nigerian multi-division company in Foods, EduServices, Chems, Scents, and Transport & Logistics, based in Enugu."),
    imageUrl: homepage?.heroImageUrl,
  });

  if (homeLoading || divLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
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

  const stats = [
    { label: "Divisions", value: "5+", icon: TrendingUp, color: "text-emerald-600" },
    { label: "Happy Clients", value: "500+", icon: Users, color: "text-amber-600" },
    { label: "Years of Excellence", value: "10+", icon: Star, color: "text-violet-600" },
    { label: "Awards Won", value: "20+", icon: Award, color: "text-rose-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[88vh] min-h-[620px] flex items-center justify-center overflow-hidden">
          <HeroSlideshow slides={heroSlides} fallbackUrl={fallbackUrl} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 z-10" />
          
          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl z-10" />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl z-10" />
          
          <div className="container relative z-20 text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Nigeria's Premier Multiconcept Corporation
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight"
            >
              {homepage?.heroTitle || "Fredora Multiconcept"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-xl md:text-2xl font-light italic text-amber-200 mb-10"
            >
              {homepage?.motto || "Giving you the best of your needs."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-13 rounded-full shadow-lg shadow-amber-500/30 font-semibold">
                <Link href="/about">Discover Our Story</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 text-base px-8 h-13 rounded-full">
                <Link href="/contact">Get in Touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="relative -mt-1 bg-white/80 backdrop-blur-sm border-b shadow-md z-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex flex-col items-center py-6 px-4 text-center"
                >
                  <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl -translate-y-1/2 translate-x-1/2" />
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
              {divisions?.map((div, index) => (
                <motion.div
                  key={div.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/divisions/${div.slug}`}>
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

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-amber-300" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-4">Our Mission</h3>
                <p className="text-lg leading-relaxed text-white/85">
                  {homepage?.missionStatement || "To consistently deliver high-quality products and services that meet the diverse needs of our customers while contributing positively to the communities we serve."}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 flex items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-emerald-300" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-4">Our Vision</h3>
                <p className="text-lg leading-relaxed text-white/85">
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
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Ready to Work With Us?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Whether you want to place an order, ask about our services, or explore a partnership — we're here for you.
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

      </main>
      
      <Footer />
    </div>
  );
}
