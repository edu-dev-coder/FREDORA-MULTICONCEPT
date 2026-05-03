import { useCart, parsePrice } from "@/contexts/CartContext";
import { useGetHomepage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingCart, Trash2, Plus, Minus, MessageCircle, PackageOpen, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

function getImageUrl(raw: string | null | undefined) {
  if (!raw) return null;
  return raw.startsWith("/objects/") ? `/api/storage${raw}` : raw;
}

function formatNGN(n: number) {
  if (n === 0) return null;
  return "₦" + n.toLocaleString("en-NG");
}

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, closeCart } = useCart();
  const { data: homepage } = useGetHomepage();
  const [, navigate] = useLocation();

  const whatsappNumber = homepage?.whatsappNumber?.replace(/\D/g, "") ?? "";

  function buildWhatsAppMessage() {
    const lines = items.map((item, i) => {
      const price = parsePrice(item.price);
      const priceStr = price > 0 ? ` — ${item.price} each` : "";
      return `${i + 1}. ${item.name} x${item.quantity}${priceStr} (${item.divisionName})`;
    });
    const total = totalPrice > 0 ? `\n\nEstimated Total: ₦${totalPrice.toLocaleString("en-NG")}` : "";
    const msg = `Hello Fredora Multiconcept! 👋\n\nI'd like to place an order:\n\n${lines.join("\n")}${total}\n\nPlease confirm availability, pricing, and delivery. Thank you!`;
    return encodeURIComponent(msg);
  }

  const handleWhatsAppOrder = () => {
    if (!whatsappNumber) {
      alert("WhatsApp not configured. Please contact us directly.");
      return;
    }
    window.open(`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-[#001847] to-[#1565C0]">
              <div className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                <h2 className="font-bold text-lg">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6 py-16">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <PackageOpen className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Browse our products and add items to get started</p>
                  </div>
                  <Button
                    onClick={() => { closeCart(); navigate("/catalogue"); }}
                    className="rounded-full gap-2 mt-2"
                  >
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {items.map((item) => {
                    const thumb = getImageUrl(item.imageUrl);
                    const lineTotal = parsePrice(item.price) * item.quantity;
                    return (
                      <div key={item.id} className="flex gap-3 p-4 hover:bg-muted/20 transition-colors">
                        {/* Thumb */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                          {thumb ? (
                            <img src={thumb} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm leading-snug line-clamp-2">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.divisionName}</p>
                          {item.price && (
                            <p className="text-sm font-bold text-primary mt-1">{item.price}</p>
                          )}
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            {lineTotal > 0 && (
                              <span className="ml-auto text-xs font-semibold text-foreground">
                                {formatNGN(lineTotal)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 self-start"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t bg-background px-5 py-5 space-y-4">
                {totalPrice > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-bold text-lg text-foreground">₦{totalPrice.toLocaleString("en-NG")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground -mt-2">Delivery fees and final pricing confirmed on order</p>
                    <Separator />
                  </>
                )}

                <Button
                  onClick={handleWhatsAppOrder}
                  className="w-full gap-2 rounded-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-6 text-base shadow-lg shadow-green-500/20"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Order via WhatsApp
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-full text-sm" onClick={closeCart}>
                    Continue Shopping
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Orders placed via WhatsApp · Delivery across Nigeria
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
