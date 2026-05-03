import { useState, useMemo } from "react";
import { useListDivisions, useListProducts, useGetHomepage } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, ShoppingBag, Wrench, Package,
  X, ChevronDown, ShoppingCart, Printer,
} from "lucide-react";
import { useSEO } from "@/lib/seo";
import { ProductCard } from "@/components/shop/ProductCard";
import { ServiceCard } from "@/components/shop/ServiceCard";
import { ProductModal, type ShopProduct } from "@/components/shop/ProductModal";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import type { Division } from "@workspace/api-client-react";

// ----- AllProductsLoader: fetches products for every division -----
function useAllProducts(divisions: Division[] | undefined) {
  const slugs = divisions?.map((d) => d.slug) ?? [];
  const q0 = useListProducts({ divisionSlug: slugs[0] ?? "__none__" }, { query: { enabled: !!slugs[0] } });
  const q1 = useListProducts({ divisionSlug: slugs[1] ?? "__none__" }, { query: { enabled: !!slugs[1] } });
  const q2 = useListProducts({ divisionSlug: slugs[2] ?? "__none__" }, { query: { enabled: !!slugs[2] } });
  const q3 = useListProducts({ divisionSlug: slugs[3] ?? "__none__" }, { query: { enabled: !!slugs[3] } });
  const q4 = useListProducts({ divisionSlug: slugs[4] ?? "__none__" }, { query: { enabled: !!slugs[4] } });
  const q5 = useListProducts({ divisionSlug: slugs[5] ?? "__none__" }, { query: { enabled: !!slugs[5] } });
  const queries = [q0, q1, q2, q3, q4, q5];
  return slugs.map((slug, i) => ({
    slug,
    products: queries[i]?.data ?? [],
    isLoading: queries[i]?.isLoading ?? false,
  }));
}

type SortOption = "default" | "az" | "za" | "price-asc" | "price-desc";
type ViewTab = "products" | "services" | "all";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Featured",
  az: "Name: A → Z",
  za: "Name: Z → A",
  "price-asc": "Price: Low → High",
  "price-desc": "Price: High → Low",
};

function parsePrice(raw: string | null | undefined): number {
  if (!raw) return -1;
  const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? -1 : n;
}

export default function Catalogue() {
  const { data: divisions, isLoading: divLoading } = useListDivisions();
  const { data: homepage } = useGetHomepage();
  const { totalItems, openCart } = useCart();

  const [search, setSearch] = useState("");
  const [divFilter, setDivFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [tab, setTab] = useState<ViewTab>("all");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);

  useSEO({
    title: "Shop — Fredora Multiconcept",
    description: "Browse and order products & services from Fredora Multiconcept — Foods, EduServices, Chems, Scents, Transport & Logistics.",
  });

  const activeDivisions = divisions?.filter((d) => !d.comingSoon) ?? [];
  const productsByDiv = useAllProducts(activeDivisions.length > 0 ? activeDivisions : undefined);

  // Build flat product list with division info
  const allProducts: ShopProduct[] = useMemo(() => {
    return productsByDiv.flatMap(({ slug, products }) => {
      const div = activeDivisions.find((d) => d.slug === slug);
      if (!div) return [];
      return products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        price: p.price,
        divisionSlug: slug,
        divisionName: div.name,
      }));
    });
  }, [productsByDiv, activeDivisions]);

  // Build flat services list with division info
  const allServices = useMemo(() => {
    return activeDivisions.flatMap((div) =>
      (div.services ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        divisionSlug: div.slug,
        divisionName: div.name,
      }))
    );
  }, [activeDivisions]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let list = allProducts;
    if (divFilter !== "all") list = list.filter((p) => p.divisionSlug === divFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "az": list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "za": list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case "price-asc": list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case "price-desc": list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
    }
    return list;
  }, [allProducts, divFilter, search, sort]);

  // Filter services
  const filteredServices = useMemo(() => {
    let list = allServices;
    if (divFilter !== "all") list = list.filter((s) => s.divisionSlug === divFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [allServices, divFilter, search]);

  const showProducts = tab === "all" || tab === "products";
  const showServices = tab === "all" || tab === "services";
  const isLoading = divLoading || productsByDiv.some((q) => q.isLoading && q.slug);

  const noResults =
    (showProducts && filteredProducts.length === 0) &&
    (showServices && filteredServices.length === 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <CartDrawer />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-[#001847] via-[#0d3a8e] to-[#1565C0] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="container relative z-10 px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-5 py-2 mb-5 text-sm font-medium">
            <ShoppingBag className="h-4 w-4 text-amber-300" />
            Fredora Shop
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-serif mb-3">
            Shop All Products & Services
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/70 max-w-xl mx-auto mb-8 text-lg">
            Browse, select, and order via WhatsApp — fast and easy.
          </motion.p>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products and services…"
              className="w-full pl-11 pr-10 py-3 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 focus:border-white/40 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Catalogue notes banner */}
      {homepage?.catalogueNotes && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-4 py-2.5 text-sm text-amber-800">
            📌 {homepage.catalogueNotes}
          </div>
        </div>
      )}

      {/* Sticky filter bar */}
      <div className="sticky top-[calc(var(--navbar-height,64px)+1px)] z-30 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3">

          {/* Division filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
            <button
              onClick={() => setDivFilter("all")}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap ${divFilter === "all" ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
            >
              All
            </button>
            {activeDivisions.map((div) => (
              <button
                key={div.slug}
                onClick={() => setDivFilter(div.slug === divFilter ? "all" : div.slug)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap ${divFilter === div.slug ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
              >
                {div.name}
              </button>
            ))}
          </div>

          {/* Products / Services toggle */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-full p-0.5 shrink-0">
            {(["all", "products", "services"] as ViewTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all capitalize ${tab === t ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t === "all" ? "All" : t === "products" ? <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />Products</span> : <span className="flex items-center gap-1"><Wrench className="h-3 w-3" />Services</span>}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative shrink-0">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-all"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {SORT_LABELS[sort]}
              <ChevronDown className="h-3 w-3" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border rounded-xl shadow-lg z-40 overflow-hidden min-w-[160px]">
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => { setSort(val); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${sort === val ? "text-primary font-semibold bg-primary/5" : "text-foreground"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-all shrink-0"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Cart
            {totalItems > 0 && (
              <span className="bg-white text-primary text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-10 max-w-7xl">

        {/* Result count */}
        {(search || divFilter !== "all") && !isLoading && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length + filteredServices.length} result{filteredProducts.length + filteredServices.length !== 1 ? "s" : ""}
              {search && <> for "<strong>{search}</strong>"</>}
              {divFilter !== "all" && <> in <strong>{activeDivisions.find(d => d.slug === divFilter)?.name}</strong></>}
            </p>
            {(search || divFilter !== "all") && (
              <button
                onClick={() => { setSearch(""); setDivFilter("all"); }}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear filters
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground">Loading shop…</p>
          </div>
        ) : noResults ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <div>
              <p className="font-semibold text-lg mb-1">No results found</p>
              <p className="text-muted-foreground text-sm">Try a different search or filter</p>
            </div>
            <Button variant="outline" className="rounded-full" onClick={() => { setSearch(""); setDivFilter("all"); }}>
              Show all items
            </Button>
          </div>
        ) : (
          <>
            {/* Products section */}
            {showProducts && filteredProducts.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <h2 className="font-bold text-lg text-foreground">Products</h2>
                  <Badge variant="secondary" className="text-xs">{filteredProducts.length}</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <AnimatePresence>
                    {filteredProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      >
                        <ProductCard product={product} onQuickView={setSelectedProduct} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Services section */}
            {showServices && filteredServices.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Wrench className="h-4 w-4 text-primary" />
                  <h2 className="font-bold text-lg text-foreground">Services</h2>
                  <Badge variant="secondary" className="text-xs">{filteredServices.length}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {filteredServices.map((service, i) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      >
                        <ServiceCard service={service} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}

        {/* Print PDF link */}
        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Need a printable version of our full catalogue?</p>
          <Button variant="outline" className="rounded-full gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Download Full Catalogue PDF
          </Button>
        </div>
      </main>

      {/* Floating cart button (mobile) */}
      {totalItems > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={openCart}
          className="fixed bottom-24 right-5 z-40 md:hidden bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl shadow-primary/30"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-[#C8003C] text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        </motion.button>
      )}

      <Footer />
    </div>
  );
}
