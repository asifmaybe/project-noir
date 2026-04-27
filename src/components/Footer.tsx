import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Specials", href: "#specials" },
  { label: "About", href: "#about" },
  { label: "Reserve", href: "#reserve" },
  { label: "Order", href: "#order" },
  { label: "Location", href: "#location" },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <span className="font-display text-3xl font-bold text-gradient-gold">NOIR</span>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">
            An exquisite dining experience where culinary artistry meets timeless elegance in the heart of Paris.
          </p>
          <div className="flex gap-4 pt-2">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-display text-lg font-semibold text-foreground">Quick Links</h4>
          <nav className="flex flex-col gap-3">
            {footerLinks.map(({ label, href }) => (
              <a key={label} href={href} className="nav-link font-body text-sm text-muted-foreground w-fit">
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-display text-lg font-semibold text-foreground">Contact</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="font-body text-sm text-muted-foreground">42 Rue de Rivoli, 75001 Paris, France</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span className="font-body text-sm text-muted-foreground">+33 1 42 60 00 00</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span className="font-body text-sm text-muted-foreground">reservations@noir.paris</span>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="space-y-4">
          <h4 className="font-display text-lg font-semibold text-foreground">Hours</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="font-body text-sm text-muted-foreground space-y-1">
                <p>Mon – Fri: 12:00 – 23:00</p>
                <p>Saturday: 11:00 – 00:00</p>
                <p>Sunday: 11:00 – 22:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-10 bg-border" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground font-body text-xs">© 2026 NOIR. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
