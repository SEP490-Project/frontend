import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Combo() {
  return (
    <div className="min-h-screen bg-[#ffffff] py-12">
      <div className="max-w-7xl mx-auto px-2">
        {/* Blossom Glow Kit Section */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center px-6 lg:px-12 py-12 lg:py-16">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#383838] leading-tight">
              Blossom Glow Kit
            </h1>

            <p className="text-[#697586] text-lg leading-relaxed">
              Reveal your skin's natural glow with our Lotus Glow Kit. Nourishing body and face
              creams with lotus extract provide deep hydration and rejuvenation. Suitable for all
              skin types. Vegan, cruelty-free, eco-friendly.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # GreatGift
              </span>
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # AntiAging
              </span>
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # GreatGift
              </span>
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # Ingredients
              </span>
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # Ingredients
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-[#fec6d4] hover:bg-[#fec6d4]/90 text-[#ffffff] font-medium px-8 py-3 rounded-lg">
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="border-[#b4b0be] text-[#383838] hover:bg-[#b4b0be]/10 px-8 py-3 rounded-lg bg-transparent"
              >
                Explore More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="order-first lg:order-last">
            <img
              src="../public/combo/pink-innisfree-skincare-products-on-wooden-planks-.jpg"
              alt="Innisfree Blossom Glow Kit products arranged on wooden planks with pink cherry blossoms in background"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </section>

        {/* Floral Essence Masks Sets Section */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center px-6 lg:px-12 py-12 lg:py-16 bg-gradient-to-br from-[#fec6d4]/10 to-[#ffffff]">
          <div className="order-last lg:order-first">
            <img
              src="../public/combo/colorful-face-mask-packages-arranged-artistically-.jpg"
              alt="Various colorful face mask packages including Chocolate Lava, Milk Tea, Volcanic, Coffee Holic, Sulfur, Vanilla Latte, and Matcha masks with floral decorations"
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#383838] leading-tight">
              Floral Essence Masks Sets
            </h2>

            <p className="text-[#697586] text-lg leading-relaxed">
              Indulge in the beauty of nature with our Floral Essence Masks set. Each mask features
              a unique blend of flower extracts to hydrate and nourish your skin. Experience the
              essence of flowers in your skincare routine.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # GreatGift
              </span>
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # AntiAging
              </span>
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # GreatGift
              </span>
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # Ingredients
              </span>
              <span className="px-3 py-1 bg-[#b4b0be]/20 text-[#383838] text-sm rounded-full">
                # Ingredients
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-[#fec6d4] hover:bg-[#fec6d4]/90 text-[#ffffff] font-medium px-8 py-3 rounded-lg">
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="border-[#b4b0be] text-[#383838] hover:bg-[#b4b0be]/10 px-8 py-3 rounded-lg bg-transparent"
              >
                Explore More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
