import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useListDivisions } from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";

const divisionColors: Record<number, string> = {
  0: "border-blue-400 text-blue-700 hover:bg-blue-700 hover:text-white hover:border-blue-700",
  1: "border-amber-400 text-amber-700 hover:bg-amber-500 hover:text-white hover:border-amber-500",
  2: "border-violet-400 text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600",
  3: "border-sky-400 text-sky-700 hover:bg-sky-600 hover:text-white hover:border-sky-600",
  4: "border-rose-400 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600",
};

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: divisions } = useListDivisions();
  const { totalItems, openCart } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/temperamap", label: "TemperaMap" },
    { href: "/news", label: "News" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      {/* Brand gradient top bar */}
      <div className="h-1 bg-gradient-to-r from-[#001847] via-[#1565C0] to-[#C8003C]" />

      {/* Main nav row */}
      <div className="container mx-auto px-4 md:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center shrink-0 group">
          <img
            src="/images/logo.png"
            alt="Fredora Multiconcept"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 lg:px-4 py-2 rounded-full transition-all ${
                location === link.href
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={openCart}
            className="relative ml-1 lg:ml-2 p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C8003C] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <Button asChild size="sm" className="ml-1 rounded-full px-4 lg:px-5 shadow-sm shadow-primary/20">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </nav>

        {/* Mobile controls (Cart + Menu Toggle) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-foreground bg-muted/50 hover:bg-muted transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8003C] text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full text-foreground bg-muted/50 hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Divisions strip — desktop */}
      {divisions && divisions.length > 0 && (
        <div className="hidden md:block border-t bg-gradient-to-r from-blue-50 via-white to-slate-50">
          <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 h-10">
            <span className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/50 mr-2 shrink-0">
              Divisions
            </span>
            <div className="flex items-center flex-wrap gap-1.5">
              {Array.isArray(divisions) && divisions.map((div, i) => (
                <Link
                  key={div.slug}
                  href={div.slug === "temperamap" ? "/temperamap" : `/divisions/${div.slug}`}
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
                {Array.isArray(divisions) && divisions.map((div, i) => (
                  <Link
                    key={div.slug}
                    href={div.slug === "temperamap" ? "/temperamap" : `/divisions/${div.slug}`}
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
