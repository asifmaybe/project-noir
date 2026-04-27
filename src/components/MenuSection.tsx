import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import dishSteak from "@/assets/dish-steak.jpg";
import dishSushi from "@/assets/dish-sushi.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishDessert from "@/assets/dish-dessert.jpg";
import dishCocktail from "@/assets/dish-cocktail.jpg";
import { useState } from "react";

const fallbackImages: Record<string, string> = {
  Mains: dishSteak,
  Starters: dishSushi,
  Desserts: dishDessert,
  Drinks: dishCocktail,
};
const defaultImages = [dishSteak, dishSushi, dishPasta, dishDessert, dishCocktail];

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const { data: categories = [] } = useQuery({
    queryKey: ["menu-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("menu_categories").select("*").order("sort_order");
      return data || [];
    },
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("*, menu_categories(name)")
        .eq("is_available", true)
        .order("sort_order");
      return data || [];
    },
  });

  const allCategories = ["All", ...categories.map((c) => c.name)];
  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter((d: any) => d.menu_categories?.name === activeCategory);

  return (
    <section id="menu" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">Our Selection</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
            The <span className="italic text-gradient-gold">Menu</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 font-body text-sm uppercase tracking-widest border transition-all duration-300 ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dish: any, i) => {
            const catName = dish.menu_categories?.name || "";
            const image = dish.image_url || fallbackImages[catName] || defaultImages[i % defaultImages.length];
            return (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="card-3d group cursor-pointer"
              >
                <div className="relative overflow-hidden bg-card rounded-lg">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-xl font-semibold text-foreground">{dish.name}</h3>
                      <span className="text-primary font-display text-xl">${dish.price}</span>
                    </div>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">{dish.description}</p>
                    <div className="mt-4 w-0 group-hover:w-full h-px bg-primary transition-all duration-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
