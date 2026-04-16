import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useListDivisions } from "@workspace/api-client-react";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main nav row */}
      <div className="container mx-auto px-4 md:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <span className="text-xl font-bold font-serif text-primary">Fredora Multiconcept</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-center text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Divisions strip — desktop */}
      {divisions && divisions.length > 0 && (
        <div className="hidden md:block border-t bg-muted/40">
          <div className="container mx-auto px-4 md:px-6 flex items-center gap-1 h-9">
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mr-3 shrink-0">
              Divisions
            </span>
            <div className="flex items-center flex-wrap gap-1">
              {divisions.map((div) => (
                <Link
                  key={div.slug}
                  href={`/divisions/${div.slug}`}
                  className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors
                    ${location === `/divisions/${div.slug}`
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
                    }
                    ${div.comingSoon ? "opacity-50 pointer-events-none" : ""}
                  `}
                >
                  {div.name}
                  {div.comingSoon && <span className="ml-1 text-[9px] uppercase">Soon</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t pt-3">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-3">
                Divisions
              </p>
              <div className="flex flex-wrap gap-2">
                {divisions?.map((div) => (
                  <Link
                    key={div.slug}
                    href={`/divisions/${div.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
                      ${location === `/divisions/${div.slug}`
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }
                      ${div.comingSoon ? "opacity-50 pointer-events-none" : ""}
                    `}
                  >
                    {div.name}
                    {div.comingSoon && <span className="ml-1 text-[9px] uppercase">Soon</span>}
                  </Link>
                ))}
              </div>
            </div>

            <Button asChild size="sm" className="mt-2 w-full" onClick={() => setIsOpen(false)}>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
