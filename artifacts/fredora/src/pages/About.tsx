import { useGetHomepage, useListDivisions } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  const { data: homepage, isLoading: homeLoading } = useGetHomepage();

  if (homeLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold font-serif mb-6"
            >
              About Fredora Multiconcept
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl max-w-2xl mx-auto text-primary-foreground/80"
            >
              A growing Nigerian conglomerate rooted in quality and community.
            </motion.p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Fredora Multiconcept is a growing Nigerian conglomerate based in Enugu, Nigeria, founded by Freda Ada Okoro. We are dedicated to providing premium quality products and services across various sectors.
                  </p>
                  <p>
                    Our journey began with a simple vision: to be the leading and most trusted multiconcept corporation in Nigeria and beyond, known for excellence, innovation, and integrity. Today, we span five major divisions, each committed to our core philosophy of giving you the best of your needs.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm border"
              >
                <h3 className="text-xl font-serif font-bold text-primary mb-4">Company Profile</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Founder & CEO</span>
                    <span className="font-medium text-foreground">Freda Ada Okoro</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Headquarters</span>
                    <span className="font-medium text-foreground">Enugu, Nigeria</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Divisions</span>
                    <span className="font-medium text-foreground">5 Operating Divisions</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Motto</span>
                    <span className="font-medium text-foreground italic">Giving you the best of your needs.</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Mission</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {homepage?.missionStatement || "To consistently deliver high-quality products and services that meet the diverse needs of our customers while contributing positively to the communities we serve."}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Vision</h2>
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
                className="mt-20"
              >
                <h2 className="text-2xl font-serif font-bold text-center mb-10 text-primary">Our Core Values</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {homepage.coreValues.map((value, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors">
                      <CheckCircle2 className="h-8 w-8 text-accent mb-4" />
                      <h4 className="font-semibold text-primary">{value}</h4>
                    </div>
                  ))}
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
