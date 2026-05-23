import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import FrederaLogo from "@/components/FrederaLogo";

const TEMPERAMENTS = [
  { name: "Sanguine", color: "bg-red-100 text-red-700 border-red-200", emoji: "🌟", desc: "Outgoing, enthusiastic & social" },
  { name: "Choleric", color: "bg-orange-100 text-orange-700 border-orange-200", emoji: "🔥", desc: "Bold, decisive & goal-oriented" },
  { name: "Melancholic", color: "bg-blue-100 text-blue-700 border-blue-200", emoji: "🌊", desc: "Thoughtful, analytical & deep" },
  { name: "Phlegmatic", color: "bg-green-100 text-green-700 border-green-200", emoji: "🌿", desc: "Calm, steady & reliable" },
];

const FEATURES = [
  { icon: "🧠", title: "60-Question Deep Assessment", desc: "Our carefully crafted questions give you the most accurate and nuanced temperament profile available — for every age." },
  { icon: "📊", title: "Detailed PDF Report", desc: "Download a comprehensive report tailored to your age group — adult careers, child parenting guides, or couples compatibility." },
  { icon: "👶", title: "Age-Specific Tests", desc: "Dedicated assessments for Ages 3–5, 6–9, 10–12, and 13–17 — each with unique questions and parenting guidance." },
  { icon: "👫", title: "Couples Compatibility", desc: "Discover how your temperaments interact, your love language match, and get tailored advice for your relationship." },
  { icon: "🏢", title: "Corporate Profiling", desc: "World-class workplace temperament assessment with leadership style, team role, and career fit reports." },
];

const PRICING = [
  { name: "Ages 3–5", price: "₦5,000", product: "child_3_5", desc: "Early childhood temperament + parenting guide", popular: false },
  { name: "Ages 6–9", price: "₦5,000", product: "child_6_9", desc: "Children — school & friendship profile", popular: false },
  { name: "Ages 10–12", price: "₦5,000", product: "preteen_10_12", desc: "Pre-teen social & academic style", popular: false },
  { name: "Ages 13–17", price: "₦5,000", product: "teen_13_17", desc: "Teenager identity & future direction", popular: false },
  { name: "Adult Test", price: "₦5,000", product: "single_test", desc: "Full 60-question assessment + PDF report", popular: false },
  { name: "Couples Test", price: "₦10,000", product: "couples_test", desc: "Two assessments + compatibility analysis", popular: true },
  { name: "Corporate Team", price: "₦150,000", product: "corporate_team", desc: "Up to 15 team members + leadership report", popular: false },
];

const TESTIMONIALS = [
  {
    name: "Adaeze O.",
    role: "HR Manager, Lagos",
    avatar: "A",
    color: "#1B3A6B",
    text: "I've been in HR for 12 years and this is the most accurate personality assessment I've ever seen. We now use it for every new hire and team-building exercise. The corporate report alone is worth it.",
  },
  {
    name: "Emeka & Chisom",
    role: "Married couple, Abuja",
    avatar: "E",
    color: "#C8961E",
    text: "We did the couples test before our wedding and it was eye-opening. It didn't just tell us our types — it explained exactly how our temperaments interact. We still refer to it 2 years later.",
  },
  {
    name: "Pastor Biodun A.",
    role: "School Principal, Port Harcourt",
    avatar: "B",
    color: "#1E8449",
    text: "We ran the school license for our senior secondary students. The accuracy was remarkable — teachers said the results matched exactly what they observe in class. It gave us a language to understand each student.",
  },
  {
    name: "Tunde M.",
    role: "Software Engineer, Lagos",
    avatar: "T",
    color: "#C0392B",
    text: "I was sceptical at first — I've taken Myers-Briggs and all the others. This one is different. The depth of the result description felt like someone had been watching me for years. My wife says it captured me perfectly.",
  },
];

const FAQS = [
  {
    q: "How accurate is the TemperaMap assessment?",
    a: "Our 60-question assessment is built on the classical four-temperament model — one of the oldest and most validated personality frameworks in history. Unlike quick 16-question tests, our depth ensures nuanced accuracy. Most users say their results feel 85–95% accurate.",
  },
  {
    q: "How long does the assessment take?",
    a: "The 60-question assessment typically takes 12–20 minutes to complete. You can pause and return if needed — your answers are saved automatically. Take it somewhere quiet for the most honest results.",
  },
  {
    q: "What do I get after completing the test?",
    a: "You receive an in-app results page with your primary and secondary temperament blend, a score breakdown, and tabs covering your strengths, relationship style, workplace profile, and career fit. You can also download a full PDF report.",
  },
  {
    q: "What is the Couples Test?",
    a: "The Couples Test includes two separate full assessments — one for each partner — plus a compatibility analysis that explains how your temperament types interact in love, conflict, communication, and long-term partnership.",
  },
  {
    q: "Can I share my results with others?",
    a: "Yes! You can share your temperament result directly from the results page. Many users share theirs with family, partners, employers, or friends.",
  },
  {
    q: "Is my payment secure?",
    a: "All payments are processed through Paystack, Nigeria's leading payment processor. We never store your card details. Your financial information is handled entirely by Paystack using industry-standard SSL encryption.",
  },
  {
    q: "What is the School License?",
    a: "The School License allows up to 20 students to take the full 60-question assessment, along with a teacher/administrator summary report showing the temperament distribution of the entire class.",
  },
  {
    q: "Can I get a refund?",
    a: "We do not offer refunds after a test session has been started, as the assessment is delivered digitally and immediately. If you experience a technical issue, please contact us at support@fredora.com within 7 days.",
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <FrederaLogo size="sm" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setLocation("/sign-in")} className="text-primary">
              Sign In
            </Button>
            <Button onClick={() => setLocation("/sign-up")} className="bg-accent hover:bg-accent/90 text-white font-semibold">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#1e4580] to-[#0f2549] text-white py-24 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 text-sm px-4 py-1">
            Discover Your True Self
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Understand Your
            <br />
            <span className="text-accent">Temperament</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Take our carefully crafted 60-question TemperaMap assessment and unlock deep insights about your personality, relationships, and purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation("/sign-up")}
              className="bg-accent hover:bg-amber-600 text-white font-bold text-lg px-8 py-6 shadow-lg"
            >
              Take the Test — From ₦5,000
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/sign-in")}
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>
          {/* Temperament badges */}
          <div className="flex flex-wrap gap-3 justify-center mt-12">
            {TEMPERAMENTS.map(t => (
              <div key={t.name} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm backdrop-blur">
                <span>{t.emoji}</span>
                <span className="font-medium">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-accent py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "60", label: "Questions" },
            { value: "4", label: "Temperament Types" },
            { value: "12+", label: "Blends Profiled" },
            { value: "100%", label: "Nigerian-built" },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-amber-100 text-sm font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Temperaments */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">The Four Temperaments</h2>
            <p className="text-muted-foreground text-lg">Ancient wisdom, modern insights — discover which blend is uniquely yours</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPERAMENTS.map(t => (
              <Card key={t.name} className="border-2 hover:shadow-lg transition-all hover:-translate-y-1 cursor-default">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{t.emoji}</div>
                  <Badge className={`mb-3 border ${t.color}`}>{t.name}</Badge>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">What You Get</h2>
            <p className="text-muted-foreground text-lg">Everything you need to understand yourself and those around you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary mb-1">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">What People Are Saying</h2>
            <p className="text-muted-foreground text-lg">Real feedback from individuals, couples, and organisations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <p className="text-foreground leading-relaxed mb-5 text-sm italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.role}</p>
                    </div>
                    <div className="ml-auto text-accent text-sm">★★★★★</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h2>
            <p className="text-blue-200 text-lg">Pay once, own your results forever</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING.map(p => (
              <Card key={p.name} className={`relative overflow-hidden transition-all hover:-translate-y-1 ${p.popular ? "border-2 border-accent bg-white" : "bg-white/10 border-white/20 text-white"}`}>
                {p.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className={`font-bold text-lg mb-1 ${p.popular ? "text-primary" : "text-white"}`}>{p.name}</h3>
                  <div className={`text-3xl font-black mb-3 text-accent`}>{p.price}</div>
                  <p className={`text-sm mb-6 ${p.popular ? "text-muted-foreground" : "text-blue-200"}`}>{p.desc}</p>
                  <Button
                    className={`w-full font-semibold ${p.popular ? "bg-primary hover:bg-primary/90 text-white" : "bg-accent hover:bg-amber-600 text-white"}`}
                    onClick={() => setLocation("/sign-up")}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know before you begin</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-primary text-sm sm:text-base">{faq.q}</span>
                  <span className="text-muted-foreground text-lg ml-4 shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-accent/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to discover yourself?</h2>
          <p className="text-muted-foreground text-lg mb-8">Join others who have already unlocked their temperament blueprint.</p>
          <Button
            size="lg"
            onClick={() => setLocation("/sign-up")}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 py-6"
          >
            Start Your Assessment Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-blue-200 py-10 px-4 text-center text-sm">
        <p className="mb-4">© {new Date().getFullYear()} Fredora TemperaMap. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-300/80 mb-3">
          <a href="/web/terms" className="hover:text-accent transition-colors">Terms of Service</a>
          <span>·</span>
          <a href="/web/privacy" className="hover:text-accent transition-colors">Privacy Policy</a>
          <span>·</span>
          <a href="mailto:support@fredora.com" className="hover:text-accent transition-colors">Contact Support</a>
        </div>
        <a
          href="/admin/"
          className="inline-block text-xs text-blue-300/40 hover:text-amber-400 transition-colors"
        >
          Admin Sign In ↗
        </a>
      </footer>
    </div>
  );
}
