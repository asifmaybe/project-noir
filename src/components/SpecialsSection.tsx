import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import dishSteak from "@/assets/dish-steak.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishDessert from "@/assets/dish-dessert.jpg";

const defaultImages = [dishSteak, dishPasta, dishDessert];

const SpecialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const { data: specials = [], isLoading } = useQuery({
    queryKey: ["specials"],
    queryFn: async () => {
      const { data } = await supabase.from("specials").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  if (!isLoading && specials.length === 0) return null;

  return (
    <section id="specials" className="section-padding bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">Limited Time</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
            Chef's <span className="italic text-gradient-gold">Specials</span>
          </h2>
        </motion.div>

        <div className="space-y-16">
          {specials.map((special, i) => (
            <motion.div
              key={special.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="card-3d overflow-hidden rounded-lg">
                  <img
                    src={special.image_url || defaultImages[i % defaultImages.length]}
                    alt={special.title}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <span className="text-primary/50 font-display text-7xl font-bold">0{i + 1}</span>
                <h3 className="font-display text-3xl md:text-4xl font-bold -mt-4 mb-4">{special.title}</h3>
                <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">{special.description}</p>
                <p className="text-primary font-display text-xl">{special.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialsSection;
