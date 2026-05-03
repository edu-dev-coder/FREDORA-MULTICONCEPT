import { Link } from "wouter";
import { useState } from "react";
import { useListDivisions, useGetHomepage, useSubscribeNewsletter } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { ArrowRight, Mail } from "lucide-react";

export function Footer() {
  const { data: divisions } = useListDivisions();
  const { data: homepage } = useGetHomepage();
  const subscribeNewsletter = useSubscribeNewsletter();
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");

  const socialLinks = [
    { url: homepage?.facebookUrl, icon: FaFacebook, label: "Facebook", color: "hover:bg-blue-600" },
    { url: homepage?.instagramUrl, icon: FaInstagram, label: "Instagram", color: "hover:bg-pink-600" },
    { url: homepage?.twitterUrl, icon: FaTwitter, label: "Twitter / X", color: "hover:bg-sky-500" },
    { url: homepage?.linkedinUrl, icon: FaLinkedin, label: "LinkedIn", color: "hover:bg-blue-700" },
    { url: homepage?.youtubeUrl, icon: FaYoutube, label: "YouTube", color: "hover:bg-red-600" },
    { url: homepage?.whatsappNumber ? `https://wa.me/${homepage.whatsappNumber.replace(/\D/g, "")}` : null, icon: FaWhatsapp, label: "WhatsApp", color: "hover:bg-emerald-600" },
  ].filter((s) => s.url);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    subscribeNewsletter.mutate({ data: { email } }, {
      onSuccess: () => { setSubscribeStatus("success"); setEmail(""); },
      onError: (err: any) => {
        if (err?.response?.status === 409) setSubscribeStatus("duplicate");
        else setSubscribeStatus("error");
      }
    });
  }

  return (
    <footer className="bg-slate-950 text-slate-200 mt-auto relative overflow-hidden">
      {/* Brand gradient top border */}
      <div className="h-1 bg-gradient-to-r from-[#001847] via-[#1565C0] to-[#C8003C]" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center mb-5">
              <img
                src="/images/logo.png"
                alt="Fredora Multiconcept"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-xs">
              {homepage?.motto || "Giving you the best of your needs. A proudly Nigerian conglomerate rooted in quality and community."}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-2.5 flex-wrap">
                {socialLinks.map(({ url, icon: Icon, label, color }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800 ${color} transition-colors text-slate-400 hover:text-white`}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-bold tracking-wide text-white mb-5 uppercase">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"><ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />About Us</Link></li>
              <li><Link href="/news" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"><ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />News</Link></li>
              <li><Link href="/catalogue" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"><ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />Catalogue</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"><ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />Contact</Link></li>
              <li><Link href="/admin/login" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"><ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />Admin Login</Link></li>
            </ul>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="text-sm font-bold tracking-wide text-white mb-5 uppercase">Divisions</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {divisions?.map((div) => (
                <li key={div.slug}>
                  <Link href={`/divisions/${div.slug}`} className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {div.name}
                    {div.comingSoon && <span className="text-[9px] uppercase font-bold text-amber-400/70 ml-1">Soon</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold tracking-wide text-white mb-5 uppercase">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">Stay updated with Fredora news, launches, and announcements.</p>
            {subscribeStatus === "success" ? (
              <div className="bg-blue-500/15 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-400 font-medium">
                Thank you for subscribing! 🎉
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setSubscribeStatus("idle"); }}
                    className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 pl-9 rounded-xl"
                    required
                  />
                </div>
                {subscribeStatus === "duplicate" && (
                  <p className="text-xs text-amber-400">This email is already subscribed.</p>
                )}
                {subscribeStatus === "error" && (
                  <p className="text-xs text-red-400">Something went wrong. Please try again.</p>
                )}
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={subscribeNewsletter.isPending}
                >
                  {subscribeNewsletter.isPending ? "Subscribing…" : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Fredora Multiconcept. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-slate-700">Enugu, Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}
