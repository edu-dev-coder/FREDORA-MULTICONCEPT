import { Link } from "wouter";
import { useGetHomepage, useListDivisions } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { data: homepage, isLoading: homeLoading } = useGetHomepage();
  const { data: divisions, isLoading: divLoading } = useListDivisions();

  if (homeLoading || divLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: homepage?.heroImageUrl
                ? `url('${homepage.heroImageUrl.startsWith("/objects/") ? `/api/storage${homepage.heroImageUrl}` : homepage.heroImageUrl}')`
                : "url('/images/hero-bg.png')"
            }}
          />
          
          <div className="container relative z-20 text-center text-white px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl md:text-7xl font-bold font-serif mb-6"
            >
              {homepage?.heroTitle || "Fredora Multiconcept"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl md:text-2xl font-light italic text-slate-200 mb-8"
            >
              {homepage?.motto || "Giving you the best of your needs."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 h-14 rounded-full">
                <Link href="/about">Discover Our Story</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">A Nigerian Conglomerate Rooted in Excellence</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {homepage?.heroSubtitle || "We are a diverse group of companies dedicated to providing premium quality products and services across various sectors, improving lives and communities."}
              </p>
            </div>
          </div>
        </section>

        {/* Divisions Section */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Divisions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our diverse portfolio of businesses, each committed to delivering the highest standards in their respective industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {divisions?.map((div, index) => (
                <motion.div
                  key={div.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/divisions/${div.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-white group cursor-pointer">
                      <div className="h-48 overflow-hidden relative">
                        <div 
                          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                          style={{ backgroundColor: div.bannerColor || 'var(--primary)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white font-serif">{div.name}</h3>
                      </div>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground line-clamp-3 mb-6">
                          {div.description}
                        </p>
                        <div className="flex items-center text-primary font-medium group-hover:underline">
                          Explore Division <ChevronRight className="ml-1 h-4 w-4" />
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
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
                <p className="text-lg leading-relaxed text-primary-foreground/90">
                  {homepage?.missionStatement || "To consistently deliver high-quality products and services that meet the diverse needs of our customers while contributing positively to the communities we serve."}
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Our Vision</h2>
                <p className="text-lg leading-relaxed text-primary-foreground/90">
                  {homepage?.visionStatement || "To be the leading and most trusted multiconcept corporation in Nigeria and beyond, known for excellence, innovation, and integrity."}
                </p>
              </div>
            </div>

            {homepage?.coreValues && homepage.coreValues.length > 0 && (
              <div className="mt-24">
                <h2 className="text-2xl font-serif font-bold text-center mb-12">Core Values</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {homepage.coreValues.map((value, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <CheckCircle2 className="h-8 w-8 text-accent mb-4" />
                      <h4 className="font-semibold text-lg">{value}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
