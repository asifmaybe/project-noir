import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Plus, Minus, X } from "lucide-react";
import { toast } from "sonner";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const OrderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: menuItems = [] } = useQuery({
    queryKey: ["order-menu-items"],
    queryFn: async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("*, menu_categories(name)")
        .eq("is_available", true)
        .order("sort_order");
      return data || [];
    },
  });

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c).filter((c) => c.quantity > 0));
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { toast.error("Add items to your cart first"); return; }
    setSubmitting(true);
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        notes: form.notes || null,
        total,
        order_type: "pickup",
      }).select().single();
      if (error) throw error;

      const orderItems = cart.map((c) => ({
        order_id: order.id,
        menu_item_id: c.id,
        item_name: c.name,
        quantity: c.quantity,
        price: c.price,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      toast.success("Order placed successfully! We'll prepare it shortly.");
      setCart([]);
      setForm({ name: "", email: "", phone: "", notes: "" });
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="order" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">Takeaway & Pickup</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
            Order <span className="italic text-gradient-gold">Online</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Menu items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2"
          >
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-display text-lg font-semibold text-foreground truncate">{item.name}</h4>
                    <span className="text-primary font-display text-lg shrink-0">${item.price}</span>
                  </div>
                  <p className="text-muted-foreground font-body text-sm truncate">{item.description}</p>
                </div>
                <button
                  onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                  className="shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>

          {/* Cart & checkout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-card rounded-lg border border-border p-6 sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl font-semibold">Your Order</h3>
              </div>

              {cart.length === 0 ? (
                <p className="text-muted-foreground font-body text-sm text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <span className="font-body text-sm text-foreground truncate flex-1">{item.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-primary transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-body text-sm w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-primary transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="font-body text-sm text-primary w-14 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-display text-lg font-semibold">Total</span>
                    <span className="font-display text-lg font-semibold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                <textarea placeholder="Special instructions..." rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" />
                <button type="submit" disabled={submitting || cart.length === 0} className="btn-primary w-full disabled:opacity-50">
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
