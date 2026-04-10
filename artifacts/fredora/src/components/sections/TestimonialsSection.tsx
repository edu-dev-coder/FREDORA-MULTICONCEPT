import { useListTestimonials } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const { data: testimonials } = useListTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by customers across Nigeria — here is what they say about us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border flex flex-col"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-muted-foreground leading-relaxed flex-1 italic">"{t.content}"</p>
              <div className="mt-6 flex items-center gap-4">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl.startsWith("/objects/") ? `/api/storage${t.avatarUrl}` : t.avatarUrl}
                    alt={t.authorName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {t.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">{t.authorName}</p>
                  {t.company && <p className="text-sm text-muted-foreground">{t.company}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
