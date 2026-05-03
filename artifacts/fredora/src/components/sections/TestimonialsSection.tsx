import { useListTestimonials } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const cardGradients = [
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-700",
  "from-rose-500 to-red-700",
  "from-lime-500 to-green-600",
];

export function TestimonialsSection() {
  const { data: testimonials } = useListTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-300 bg-white/10 px-4 py-1.5 rounded-full mb-6">
            Testimonials
          </span>
          <h2 className="text-4xl font-serif font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Trusted by customers across Nigeria — here is what they say about us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col hover:bg-white/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cardGradients[i % cardGradients.length]} flex items-center justify-center mb-5 shadow-lg`}>
                <Quote className="h-5 w-5 text-white" />
              </div>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed flex-1 italic text-sm">"{t.content}"</p>
              <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-5">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl.startsWith("/objects/") ? `/api/storage${t.avatarUrl}` : t.avatarUrl}
                    alt={t.authorName}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${cardGradients[i % cardGradients.length]} flex items-center justify-center text-white font-bold text-base shadow-sm`}>
                    {t.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{t.authorName}</p>
                  {t.company && <p className="text-sm text-slate-400">{t.company}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
