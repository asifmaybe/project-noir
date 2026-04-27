import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import OffersSection from "@/components/OffersSection";
import AboutSection from "@/components/AboutSection";
import SpecialsSection from "@/components/SpecialsSection";
import OrderSection from "@/components/OrderSection";
import LocationSection from "@/components/LocationSection";
import ReserveSection from "@/components/ReserveSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <OffersSection />
      <MenuSection />
      <AboutSection />
      <SpecialsSection />
      <OrderSection />
      <LocationSection />
      <ReserveSection />
      <ReviewsSection />
    </main>
    <Footer />
  </>
);

export default Index;
