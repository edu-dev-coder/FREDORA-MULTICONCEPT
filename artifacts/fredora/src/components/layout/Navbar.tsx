import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useListDivisions } from "@workspace/api-client-react";

const divisionColors: Record<number, string> = {
  0: "border-emerald-400 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600",
  1: "border-amber-400 text-amber-700 hover:bg-amber-500 hover:text-white hover:border-amber-500",
  2: "border-violet-400 text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600",
  3: "border-sky-400 text-sky-700 hover:bg-sky-600 hover:text-white hover:border-sky-600",
  4: "border-rose-400 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600",
};

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: divisions } = useListDivisions();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      {/* Colorful top accent bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />

      {/* Main nav row */}
      <div className="container mx-auto px-4 md:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            F
          </div>
          <span className="text-lg font-bold font-serif text-foreground group-hover:text-primary transition-colors">
            Fredora <span className="hidden sm:inline text-muted-foreground font-normal text-base">Multiconcept</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
                location === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-3 rounded-full px-5 shadow-sm shadow-primary/20">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-foreground bg-muted/50 hover:bg-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Divisions strip — desktop */}
      {divisions && divisions.length > 0 && (
        <div className="hidden md:block border-t bg-gradient-to-r from-emerald-50 via-white to-amber-50">
          <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 h-10">
            <span className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/50 mr-2 shrink-0">
              Divisions
            </span>
            <div className="flex items-center flex-wrap gap-1.5">
              {divisions.map((div, i) => (
                <Link
                  key={div.slug}
                  href={`/divisions/${div.slug}`}
                  className={`text-xs font-semibold px-3.5 py-1 rounded-full border transition-all
                    ${location === `/divisions/${div.slug}`
                      ? "bg-primary text-white border-primary shadow-sm"
                      : (divisionColors[i % Object.keys(divisionColors).length] || "border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary hover:text-white")
                    }
                    ${div.comingSoon ? "opacity-40 pointer-events-none" : ""}
                  `}
                >
                  {div.name}
                  {div.comingSoon && <span className="ml-1 text-[8px] uppercase font-black opacity-80">Soon</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${
                  location === link.href
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t mt-3 pt-4">
              <p className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/50 mb-3 px-1">
                Divisions
              </p>
              <div className="flex flex-wrap gap-2">
                {divisions?.map((div, i) => (
                  <Link
                    key={div.slug}
                    href={`/divisions/${div.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all
                      ${location === `/divisions/${div.slug}`
                        ? "bg-primary text-white border-primary"
                        : (divisionColors[i % Object.keys(divisionColors).length] || "border-border text-muted-foreground")
                      }
                      ${div.comingSoon ? "opacity-40 pointer-events-none" : ""}
                    `}
                  >
                    {div.name}
                    {div.comingSoon && <span className="ml-1 text-[8px] uppercase">Soon</span>}
                  </Link>
                ))}
              </div>
            </div>

            <Button asChild size="sm" className="mt-4 w-full rounded-full" onClick={() => setIsOpen(false)}>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
