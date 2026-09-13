import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Star, Check, ArrowRight } from "lucide-react";
import { useSEO } from "@/lib/seo";

const APP_URL = import.meta.env.VITE_TEMPERAMAP_URL ?? "http://localhost:5001/";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const temperaments = [
  {
    emoji: "🌟", name: "Sanguine", color: "from-amber-400 to-orange-400", bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700", desc: "Outgoing, enthusiastic & social. The life of every room — warm, spontaneous, and expressive.",
  },
  {
    emoji: "🔥", name: "Choleric", color: "from-red-500 to-rose-500", bg: "bg-red-50 border-red-200",
    text: "text-red-700", desc: "Bold, decisive & goal-oriented. Natural leaders who thrive on challenge and achievement.",
  },
  {
    emoji: "🌊", name: "Melancholic", color: "from-blue-500 to-indigo-500", bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700", desc: "Thoughtful, analytical & deep. Detail-focused perfectionists with rich inner lives.",
  },
  {
    emoji: "🌿", name: "Phlegmatic", color: "from-green-500 to-teal-500", bg: "bg-green-50 border-green-200",
    text: "text-green-700", desc: "Calm, steady & reliable. Peacemakers who bring balance and consistency everywhere.",
  },
];

const steps = [
  { n: "01", title: "Sign Up & Choose Your Test", desc: "Create your account and select the assessment that fits your needs — individual, couples, school, or corporate." },
  { n: "02", title: "Complete the 60-Question Assessment", desc: "Answer honestly. The test takes 15–20 minutes and is designed for accuracy and depth." },
  { n: "03", title: "Download Your Detailed PDF Report", desc: "Receive a comprehensive personality blueprint with actionable insights for work, relationships, and life." },
];

const features = [
  { emoji: "🧠", title: "Deep 60-Question Assessment", desc: "Scientifically structured questions that reveal your true temperament blend, not just a surface-level type." },
  { emoji: "📊", title: "Detailed PDF Report", desc: "A beautifully formatted, shareable report breaking down your temperament strengths, weaknesses, and tendencies." },
  { emoji: "👫", title: "Couples Compatibility Test", desc: "Understand how your temperament interacts with your partner's for deeper connection and fewer conflicts." },
  { emoji: "🏫", title: "School Licensing for Educators", desc: "Equip your students with self-awareness. Group licenses available with class summary reports." },
  { emoji: "🏢", title: "Corporate Team Profiling", desc: "Build high-performing teams by understanding each member's personality dynamics and leadership style." },
  { emoji: "🔒", title: "Secure & Private", desc: "Your results are yours alone. We never sell or share your personal data with third parties." },
];

const pricing = [
  {
    name: "Individual Test", popular: false,
    desc: "Full 60-question assessment + detailed PDF report",
    perks: ["60-question test", "Detailed PDF report", "Instant results", "Lifetime access"],
  },
  {
    name: "Couples Test", popular: true,
    desc: "Two assessments + compatibility report",
    perks: ["Two full assessments", "Compatibility report", "Relationship insights", "Conflict resolution tips"],
  },
  {
    name: "School License", popular: false,
    desc: "Up to 20 students + class summary report",
    perks: ["Up to 20 students", "Class summary report", "Teacher dashboard", "6-month access"],
  },
  {
    name: "Corporate Team", popular: false,
    desc: "Up to 15 members + leadership & team dynamics report",
    perks: ["Up to 15 members", "Team dynamics report", "Leadership profile", "HR integration support"],
  },
];

const testimonials = [
  { name: "Adaeze Okonkwo", role: "HR Manager, Lagos", rating: 5, quote: "TemperaMap transformed how we build teams. Understanding each member's temperament has reduced conflicts and improved output dramatically." },
  { name: "Emmanuel Uche", role: "Secondary School Principal, Enugu", rating: 5, quote: "We licensed it for our graduating students. The self-awareness it gave them is something no textbook could provide. Truly remarkable." },
  { name: "Chidinma & Tobenna", role: "Newlyweds, Abuja", rating: 5, quote: "We took the couples test before our wedding. The compatibility report sparked the deepest conversations we've ever had." },
];

const faqs = [
  { q: "How long does the test take?", a: "The assessment typically takes 15–20 minutes to complete. You can pause and resume at any time within your session window." },
  { q: "Is this test scientifically accurate?", a: "Yes. TemperaMap is built on the classical four-temperament model (Sanguine, Choleric, Melancholic, Phlegmatic), refined with modern psychometric principles for depth and reliability." },
  { q: "Can I retake the test?", a: "If you'd like to retake the test — for example after significant life changes — you can start a new assessment." },
  { q: "What do I get after completing the test?", a: "You receive a detailed PDF report covering your temperament blend, core strengths, growth areas, relationship tendencies, and career insights — all personalized to your answers." },
  { q: "Is the Couples Test done together or separately?", a: "Each partner completes the assessment independently on their own device. The results are then combined to generate a compatibility report that highlights your dynamic as a couple." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1B3A6B]/15 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-[#1B3A6B] hover:bg-[#1B3A6B]/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-[#C8961E]" /> : <ChevronDown className="h-4 w-4 shrink-0 text-[#C8961E]" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-[#1B3A6B]/10 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function TemperaMap() {
  useSEO({
    title: "Fredora TemperaMap — Discover Your Temperament Blueprint",
    description: "A 60-question scientific assessment that reveals your unique personality blend and what it means for your relationships, work, and life.",
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-br from-[#0d1f3c] via-[#1B3A6B] to-[#0a2a5e] py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", backgroundSize: "36px 36px" }} />
        {/* Gold accent ring */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#C8961E]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-[#C8961E]/5 blur-3xl" />

        <div className="container relative z-10 px-4 text-center">
          {/* Logo mark */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#1B3A6B] border-2 border-[#C8961E] flex items-center justify-center shadow-lg">
              <span className="text-[#C8961E] font-black text-xl">F</span>
            </div>
            <div className="text-left">
              <p className="text-white font-black text-sm tracking-widest">FREDORA</p>
              <p className="text-[#C8961E] font-bold text-xs tracking-[0.2em]">TEMPERAMAP</p>
            </div>
          </motion.div>

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-5">
            Discover Your<br />
            <span className="text-[#C8961E]">Temperament Blueprint</span>
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A 60-question scientific assessment that reveals your unique personality blend — and what it means for your relationships, work, and life.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#C8961E] hover:bg-[#b07f16] text-white font-bold rounded-full px-8 py-6 text-base shadow-xl shadow-[#C8961E]/30 gap-2">
                Take the Test <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#what-is">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base border-white/30 text-white hover:bg-white/10 hover:text-white">
                Learn More
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── WHAT IS TEMPERAMAP ─── */}
      <section id="what-is" className="py-24 bg-white">
        <div className="container px-4 max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#C8961E] bg-[#C8961E]/10 px-4 py-1.5 rounded-full mb-4">
              The Science
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1B3A6B] mb-4">What Is TemperaMap?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              TemperaMap is built on the classical four-temperament model — one of the oldest frameworks for understanding human personality, now refined with modern psychometrics. Every person is a unique blend of these four fundamental types.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {temperaments.map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className={`rounded-2xl border p-6 text-center ${t.bg}`}>
                <div className={`text-4xl mb-3`}>{t.emoji}</div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-black mb-3 bg-gradient-to-r ${t.color} text-white`}>
                  {t.name}
                </div>
                <p className={`text-sm leading-relaxed ${t.text}`}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#1B3A6B] bg-[#1B3A6B]/10 px-4 py-1.5 rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1B3A6B]">How It Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#1B3A6B]/20 via-[#C8961E]/50 to-[#1B3A6B]/20" />
            {steps.map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-2xl p-7 text-center shadow-sm border border-[#1B3A6B]/10 hover:shadow-lg transition-shadow relative">
                <div className="w-16 h-16 rounded-2xl bg-[#1B3A6B] text-[#C8961E] font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  {s.n}
                </div>
                <h3 className="font-bold text-[#1B3A6B] text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-white">
        <div className="container px-4 max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#C8961E] bg-[#C8961E]/10 px-4 py-1.5 rounded-full mb-4">
              Everything Included
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1B3A6B]">Built for Depth & Clarity</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-2xl border border-[#1B3A6B]/10 p-6 hover:border-[#C8961E]/40 hover:shadow-lg transition-all group">
                <div className="text-3xl mb-4">{f.emoji}</div>
                <h3 className="font-bold text-[#1B3A6B] mb-2 group-hover:text-[#C8961E] transition-colors">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-[#0d1f3c] to-[#1B3A6B]">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#C8961E] bg-[#C8961E]/15 px-4 py-1.5 rounded-full mb-4">
                Plans
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Choose Your Path</h2>
              <p className="text-white/60 mt-3">Pick the plan that fits your needs.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricing.map((p, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className={`relative rounded-2xl p-6 flex flex-col transition-all ${
                  p.popular
                    ? "bg-[#C8961E] text-white shadow-2xl shadow-[#C8961E]/30 scale-[1.03]"
                    : "bg-white/10 backdrop-blur text-white border border-white/15 hover:bg-white/15"
                }`}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#C8961E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow">
                    Popular
                  </div>
                )}
                <h3 className="font-bold text-base mb-1">{p.name}</h3>
                <p className={`text-xs mb-5 leading-relaxed ${p.popular ? "text-white/80" : "text-white/60"}`}>{p.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-xs">
                      <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${p.popular ? "text-white" : "text-[#C8961E]"}`} />
                      <span className={p.popular ? "text-white/90" : "text-white/80"}>{perk}</span>
                    </li>
                  ))}
                </ul>
                <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                  <Button className={`w-full rounded-full font-bold py-5 ${
                    p.popular
                      ? "bg-white text-[#C8961E] hover:bg-white/90"
                      : "bg-[#C8961E] text-white hover:bg-[#b07f16]"
                  }`}>
                    Get Started
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#1B3A6B] bg-[#1B3A6B]/10 px-4 py-1.5 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1B3A6B]">What Our Users Say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-2xl p-7 shadow-sm border border-[#1B3A6B]/10 hover:shadow-lg transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#C8961E] text-[#C8961E]" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-[#1B3A6B] text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 bg-white">
        <div className="container px-4 max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#C8961E] bg-[#C8961E]/10 px-4 py-1.5 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1B3A6B]">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <FAQItem q={f.q} a={f.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 bg-gradient-to-br from-[#0d1f3c] via-[#1B3A6B] to-[#0a2a5e] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#C8961E]/10 blur-3xl" />
        <div className="container relative z-10 px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Ready to understand<br />yourself better?
            </h2>
            <p className="text-white/60 mb-8 text-lg">Join thousands of Nigerians who've discovered their temperament blueprint.</p>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#C8961E] hover:bg-[#b07f16] text-white font-black rounded-full px-10 py-7 text-lg shadow-2xl shadow-[#C8961E]/30 gap-2">
                Start Your Assessment <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
