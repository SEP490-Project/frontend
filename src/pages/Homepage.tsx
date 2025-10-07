import BestSeller from "@/components/home/BestSeller";
import Blogs from "@/components/home/Blogs";
import BloomBeautyGallery from "@/components/home/BloomBeautyGallery";
import Combo from "@/components/home/Combo";
import { HeroSection } from "@/components/home/HeroSection";
import NewArrivals from "@/components/home/NewArrivals";

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
