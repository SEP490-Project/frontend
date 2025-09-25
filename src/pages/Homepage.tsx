import BestSeller from "@/components/layout/global/BestSeller";
import Blogs from "@/components/layout/global/Blogs";
import BloomBeautyGallery from "@/components/layout/global/BloomBeautyGallery";
import Combo from "@/components/layout/global/Combo";
import { HeroSection } from "@/components/layout/global/HeroSection";
import NewArrivals from "@/components/layout/global/NewArrivals";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <NewArrivals />
        <BestSeller />
        <Combo />
        <Blogs />
        <BloomBeautyGallery />
      </main>
    </div>
  );
};

export default Homepage;
