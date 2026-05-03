import { useGetHomepage, useListDivisions } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Star, TrendingUp, MapPin, Users, Award, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  const { data: homepage, isLoading: homeLoading } = useGetHomepage();

  if (homeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(152, 68%, 22%) 0%, hsl(152, 68%, 32%) 60%, hsl(175, 60%, 28%) 100%)' }}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-xs font-bold tracking-widest uppercase text-amber-300 bg-white/10 px-4 py-1.5 rounded-full mb-6"
            >
              Our Story
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold font-serif mb-6 text-white leading-tight"
            >
              About Fredora<br />Multiconcept
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl max-w-2xl mx-auto text-white/80"
            >
              A growing Nigerian conglomerate rooted in quality, community, and excellence.
            </motion.p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
                  Who We Are
                </span>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Fredora Multiconcept is a growing Nigerian conglomerate based in Enugu, Nigeria, founded by Freda Ada Okoro. We are dedicated to providing premium quality products and services across various sectors.
                  </p>
                  <p>
                    Our journey began with a simple vision: to be the leading and most trusted multiconcept corporation in Nigeria and beyond, known for excellence, innovation, and integrity. Today, we span five major divisions, each committed to our core philosophy of giving you the best of your needs.
                  </p>
                </div>
                <Button asChild className="mt-8 rounded-full px-8">
                  <Link href="/contact">Work With Us <ChevronRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-xl border"
              >
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white">
                  <h3 className="text-xl font-serif font-bold mb-6">Company Profile</h3>
                  <ul className="space-y-4 text-sm">
                    {[
                      { label: "Founder & CEO", value: "Freda Ada Okoro", icon: Users },
                      { label: "Headquarters", value: "Enugu, Nigeria", icon: MapPin },
                      { label: "Divisions", value: "5 Operating Divisions", icon: TrendingUp },
                      { label: "Motto", value: "Giving you the best of your needs.", icon: Star, italic: true },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 border-b border-white/20 pb-4 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <item.icon className="h-4 w-4 text-amber-300" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-0.5">{item.label}</p>
                          <p className={`font-semibold ${item.italic ? "italic" : ""}`}>{item.value}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission / Vision */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-100/50 blur-3xl" />
          <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-5">
                Our Purpose
              </span>
              <h2 className="text-3xl font-serif font-bold text-foreground">Mission & Vision</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-10 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">Our Mission</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {homepage?.missionStatement || "To consistently deliver high-quality products and services that meet the diverse needs of our customers while contributing positively to the communities we serve."}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl p-10 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-5">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">Our Vision</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {homepage?.visionStatement || "To be the leading and most trusted multiconcept corporation in Nigeria and beyond, known for excellence, innovation, and integrity."}
                </p>
              </motion.div>
            </div>

            {homepage?.coreValues && homepage.coreValues.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16"
              >
                <h2 className="text-2xl font-serif font-bold text-center mb-10 text-foreground">Our Core Values</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {homepage.coreValues.map((value, i) => {
                    const colors = [
                      "from-emerald-500 to-teal-600",
                      "from-amber-500 to-orange-600",
                      "from-violet-500 to-purple-700",
                      "from-sky-500 to-blue-700",
                    ];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                        className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center mb-4 shadow-sm`}>
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-foreground">{value}</h4>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
