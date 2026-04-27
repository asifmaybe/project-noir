import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Navigation } from "lucide-react";

const LocationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="location" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">Find Us</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
            Our <span className="italic text-gradient-gold">Location</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-xl overflow-hidden border border-border"
        >
          {/* Styled dark map background */}
          <div className="relative h-[400px] md:h-[500px] bg-card overflow-hidden">
            {/* Grid pattern for map aesthetic */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }} />
            
            {/* Decorative roads */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-border/50" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-border/30" />
            <div className="absolute left-1/4 top-0 bottom-0 w-px bg-border/40" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-border/30" />
            
            {/* Diagonal road */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-[200%] h-px bg-border/20 origin-top-right" style={{ transform: 'rotate(25deg)' }} />
            </div>

            {/* Center pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute -inset-4 rounded-full bg-primary/20" />
                <div className="relative w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-gold">
                  <MapPin className="w-7 h-7 text-primary-foreground" />
                </div>
              </div>
              <div className="mt-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-6 py-3 text-center">
                <p className="font-display text-lg font-semibold text-foreground">NOIR Restaurant</p>
                <p className="text-muted-foreground font-body text-sm">42 Rue de Rivoli, Paris</p>
              </div>
            </div>

            {/* Corner labels */}
            <div className="absolute top-4 left-4 text-muted-foreground/30 font-body text-xs uppercase tracking-widest">
              Rue de Rivoli
            </div>
            <div className="absolute bottom-4 right-4 text-muted-foreground/30 font-body text-xs uppercase tracking-widest">
              Île de la Cité
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-card border-t border-border px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="font-body text-sm text-muted-foreground">42 Rue de Rivoli, 75001 Paris, France</span>
            </div>
            <a
              href="https://maps.google.com/?q=42+Rue+de+Rivoli+Paris"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs py-2 px-5"
            >
              Get Directions
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationSection;
