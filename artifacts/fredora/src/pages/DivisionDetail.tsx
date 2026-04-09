import { useParams } from "wouter";
import { useGetDivision, getGetDivisionQueryKey } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DivisionDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const { data: division, isLoading } = useGetDivision(slug, { query: { enabled: !!slug, queryKey: getGetDivisionQueryKey(slug) } });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!division) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-muted-foreground">Division not found.</div>;
  }

  const defaultBgImageMap: Record<string, string> = {
    'foods': '/images/foods-banner.png',
    'eduservices': '/images/eduservices-banner.png',
    'chems': '/images/chems-banner.png',
    'scents': '/images/scents-banner.png',
    'transport': '/images/transport-banner.png'
  };

  const rawImageUrl = division.imageUrl;
  const bgImage = rawImageUrl
    ? (rawImageUrl.startsWith("/objects/") ? `/api/storage${rawImageUrl}` : rawImageUrl)
    : (defaultBgImageMap[slug] || '/images/hero-bg.png');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-slate-50">
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/70 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
          <div className="container relative z-20 text-center text-white px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold font-serif mb-4"
            >
              {division.name}
            </motion.h1>
            {division.tagline && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl font-light text-slate-200"
              >
                {division.tagline}
              </motion.p>
            )}
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {division.comingSoon && (
                <div className="mb-12 bg-accent/10 border-l-4 border-accent p-6 rounded-r-lg flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-accent shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Coming Soon</h3>
                    <p className="text-muted-foreground">This division is currently under development. Stay tuned for our launch.</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 shadow-sm border mb-12">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">About this Division</h2>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {division.description}
                </p>
              </div>

              {division.services && division.services.length > 0 && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-primary mb-8 text-center">Our Products & Services</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {division.services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                              <div>
                                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                                {service.description && (
                                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                                )}
                              </div>
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
      </main>

      <Footer />
    </div>
  );
}
