import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Offers", href: "#offers" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Specials", href: "#specials" },
  { label: "Order", href: "#order" },
  { label: "Reserve", href: "#reserve" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-24 py-5 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <button onClick={() => scrollTo("#home")} className="font-display text-2xl font-bold text-foreground tracking-wider">
        <span className="text-gradient-gold">NOIR</span>
      </button>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollTo(item.href)}
            className="nav-link font-body text-xs uppercase tracking-widest"
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => scrollTo("#reserve")}
        className="hidden md:block font-body text-xs uppercase tracking-widest px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        Book a Table
      </button>

      {/* Mobile toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground z-50">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center gap-6 md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => scrollTo(item.href)}
                className="font-display text-2xl text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
