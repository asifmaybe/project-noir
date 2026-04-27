import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ReserveSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", date: "", guests: "2", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("reservations").insert({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        guests: parseInt(formData.guests),
        message: formData.message || null,
      });
      if (error) throw error;
      toast.success("Reservation request sent! We'll confirm shortly.");
      setFormData({ name: "", email: "", date: "", guests: "2", message: "" });
    } catch {
      toast.error("Failed to submit reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reserve" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">Book Your Experience</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
            Make a <span className="italic text-gradient-gold">Reservation</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" />
              <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field" />
              <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="input-field" />
              <select value={formData.guests} onChange={e => setFormData({ ...formData, guests: e.target.value })} className="input-field">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n} className="bg-background">{n} Guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <textarea placeholder="Special requests..." rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="input-field resize-none" />
            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto disabled:opacity-50">
              {submitting ? "Submitting..." : "Reserve Table"}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {[
              { icon: MapPin, title: "Location", text: "42 Rue de Rivoli, Paris, France" },
              { icon: Phone, title: "Contact", text: "+33 1 42 60 82 82" },
              { icon: Clock, title: "Hours", text: "Tue–Sun: 6PM – 11PM\nClosed Mondays" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 border border-primary/30 rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold mb-1">{title}</h4>
                  <p className="text-muted-foreground font-body text-sm whitespace-pre-line">{text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReserveSection;
