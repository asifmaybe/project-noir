import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import chefImg from "@/assets/chef.jpg";
import interiorImg from "@/assets/restaurant-interior.jpg";

const stats = [
  { number: "15+", label: "Years of Excellence" },
  { number: "50K", label: "Happy Guests" },
  { number: "3", label: "Michelin Stars" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="about" className="section-padding overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              A Passion for <span className="italic text-gradient-gold">Perfection</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
              Founded in 2018, NOIR was born from a vision to create an immersive dining experience
              that transcends the ordinary. Every detail — from the ambient lighting to the carefully
              curated ingredients — is designed to engage all your senses.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              Our chef brings over 20 years of international culinary expertise, blending French technique
              with Asian flavors to create dishes that are both familiar and surprising.
            </p>
            <div className="flex gap-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span className="font-display text-3xl font-bold text-primary">{stat.number}</span>
                  <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="relative">
              <img src={chefImg} alt="Head chef at NOIR" className="w-full max-w-md mx-auto rounded-lg shadow-2xl" loading="lazy" />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-primary/30 rounded-lg" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative rounded-xl overflow-hidden group"
        >
          <img
            src={interiorImg}
            alt="NOIR restaurant interior"
            className="w-full h-[50vh] object-cover group-hover:scale-105 transition-transform duration-1000"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">The Ambience</h3>
            <p className="text-muted-foreground font-body max-w-md">
              An intimate setting designed to make every visit unforgettable.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
