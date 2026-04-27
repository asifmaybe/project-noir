import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Sophie Laurent",
    date: "2 weeks ago",
    rating: 5,
    text: "An absolutely magical evening. The tasting menu was a masterclass in flavour and presentation. Every dish told a story. The service was impeccable — truly a Parisian gem.",
    avatar: "SL",
  },
  {
    name: "James Mitchell",
    date: "1 month ago",
    rating: 5,
    text: "NOIR exceeded every expectation. The ambiance is stunning, dark and intimate with beautiful gold accents. The wagyu was the best I've ever had. Worth every euro.",
    avatar: "JM",
  },
  {
    name: "Elena Rossi",
    date: "3 weeks ago",
    rating: 5,
    text: "We celebrated our anniversary here and it was unforgettable. Chef Moreau's creations are works of art. The sommelier's wine pairings were exceptional.",
    avatar: "ER",
  },
  {
    name: "David Chen",
    date: "1 week ago",
    rating: 4,
    text: "Incredible atmosphere and world-class cuisine. The cocktail program is just as impressive as the food. A must-visit for any food lover in Paris.",
    avatar: "DC",
  },
  {
    name: "Marie Dubois",
    date: "2 months ago",
    rating: 5,
    text: "From the moment you walk in, you know this is somewhere special. The attention to detail in every aspect — food, decor, service — is remarkable. Bravo!",
    avatar: "MD",
  },
  {
    name: "Oliver Park",
    date: "3 days ago",
    rating: 5,
    text: "The black truffle risotto was divine. Staff made us feel like royalty. Already planning our next visit. Paris's finest dining experience without question.",
    avatar: "OP",
  },
];

const OVERALL_RATING = 4.8;
const TOTAL_REVIEWS = 342;

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review, index }: { review: typeof REVIEWS[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 card-3d"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
        <span className="font-display text-xs font-semibold text-primary">{review.avatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-foreground truncate">{review.name}</p>
        <p className="font-body text-xs text-muted-foreground">{review.date}</p>
      </div>
    </div>
    <Stars count={review.rating} />
    <p className="font-body text-sm text-muted-foreground leading-relaxed">{review.text}</p>
  </motion.div>
);

const ReviewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="reviews" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">What Our Guests Say</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Guest <span className="italic text-gradient-gold">Reviews</span>
          </h2>

          {/* Overall rating badge */}
          <div className="inline-flex items-center gap-4 bg-card border border-border rounded-full px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold text-foreground">{OVERALL_RATING}</span>
              <Stars count={5} />
            </div>
            <div className="w-px h-6 bg-border" />
            <span className="font-body text-sm text-muted-foreground">{TOTAL_REVIEWS} reviews on Google</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <ReviewCard key={review.name} review={review} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <a
            href="https://maps.google.com/?q=42+Rue+de+Rivoli+Paris"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs"
          >
            See All Reviews on Google
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
