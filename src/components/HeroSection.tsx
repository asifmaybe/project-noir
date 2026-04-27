import { motion } from "framer-motion";
import heroDish from "@/assets/hero-dish.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center section-padding pt-28 overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center w-full max-w-7xl mx-auto">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-5"
          >
            Fine Dining Experience
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] mb-7"
          >
            The Art of{" "}
            <span className="italic text-gradient-gold">Culinary</span>{" "}
            Excellence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-muted-foreground font-body text-lg max-w-md mb-9 leading-relaxed"
          >
            Where every dish tells a story and every flavor takes you on a journey.
            Experience dining reimagined.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#menu" className="btn-primary">Explore Menu</a>
            <a href="#reserve" className="btn-outline">Reserve Now</a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="relative group">
            <div className="absolute -inset-6 bg-primary/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <img
              src={heroDish}
              alt="Signature dish at NOIR restaurant"
              className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              loading="eager"
              decoding="async"
            />
            <div
              className="absolute -top-3 -right-3 md:top-6 md:right-2 w-22 h-22 rounded-full border-2 border-dashed border-primary flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm animate-float"
              style={{ width: 88, height: 88 }}
            >
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Start</span>
              <span className="text-xl font-display font-bold text-primary leading-none">30%</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Off</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
