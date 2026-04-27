import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Percent, Clock } from "lucide-react";

const icons = [Percent, Gift, Clock];

const OffersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  if (!isLoading && offers.length === 0) return null;

  return (
    <section id="offers" className="section-padding bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">Exclusive Deals</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
            Special <span className="italic text-gradient-gold">Offers</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="card-3d group"
              >
                <div className="relative bg-card rounded-lg p-8 border border-border hover:border-primary/50 transition-colors duration-500 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center mb-6 group-hover:border-primary transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-display text-3xl font-bold text-gradient-gold mb-3 block">{offer.discount_text}</span>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">{offer.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed flex-1">{offer.description}</p>
                  {offer.valid_until && (
                    <p className="text-primary/70 font-body text-xs mt-4 uppercase tracking-wider">
                      Valid until {new Date(offer.valid_until).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-4 w-0 group-hover:w-full h-px bg-primary transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
