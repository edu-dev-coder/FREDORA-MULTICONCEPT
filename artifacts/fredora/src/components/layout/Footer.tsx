import { Link } from "wouter";
import { useState } from "react";
import { useListDivisions, useGetHomepage, useSubscribeNewsletter } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const { data: divisions } = useListDivisions();
  const { data: homepage } = useGetHomepage();
  const subscribeNewsletter = useSubscribeNewsletter();
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");

  const socialLinks = [
    { url: homepage?.facebookUrl, icon: FaFacebook, label: "Facebook" },
    { url: homepage?.instagramUrl, icon: FaInstagram, label: "Instagram" },
    { url: homepage?.twitterUrl, icon: FaTwitter, label: "Twitter / X" },
    { url: homepage?.linkedinUrl, icon: FaLinkedin, label: "LinkedIn" },
    { url: homepage?.youtubeUrl, icon: FaYoutube, label: "YouTube" },
    { url: homepage?.whatsappNumber ? `https://wa.me/${homepage.whatsappNumber.replace(/\D/g, "")}` : null, icon: FaWhatsapp, label: "WhatsApp" },
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
    <footer className="bg-slate-950 text-slate-200 py-12 border-t border-slate-900 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold font-serif text-white">Fredora</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 max-w-xs">
              {homepage?.motto || "Giving you the best of your needs. A proudly Nigerian conglomerate rooted in quality and community."}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-primary transition-colors text-slate-400 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Divisions</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {divisions?.map((div) => (
                <li key={div.slug}>
                  <Link href={`/divisions/${div.slug}`} className="hover:text-primary transition-colors">
                    {div.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Stay updated with Fredora news and announcements.</p>
            {subscribeStatus === "success" ? (
              <p className="text-sm text-green-400 font-medium">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSubscribeStatus("idle"); }}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary"
                  required
                />
                {subscribeStatus === "duplicate" && (
                  <p className="text-xs text-amber-400">This email is already subscribed.</p>
                )}
                {subscribeStatus === "error" && (
                  <p className="text-xs text-red-400">Something went wrong. Please try again.</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={subscribeNewsletter.isPending}
                >
                  {subscribeNewsletter.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fredora Multiconcept. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
