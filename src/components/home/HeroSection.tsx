import { Button } from "@/components/ui/button";

export function HeroSection() {
  const heroBackground = "/hero/hero-section.png";
  return (
    <section className="relative overflow-hidden min-h-[80vh]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: heroBackground ? `url(${heroBackground})` : "none",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#f5e0e5]/90 via-[#f5e0e5]/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="flex items-center min-h-[60vh]">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#383838] leading-tight text-balance">
                DISCOVER YOUR INNER BEAUTY
                <br />
                <span className="text-[#383838]">WITH BLOSSOM GLOW KIT</span>
              </h1>
              <p className="text-lg text-[#383838] opacity-80 text-pretty">
                Great gift for yourself and loved ones
              </p>
            </div>

            <Button
              size="lg"
              className="bg-[#fec6d4] hover:bg-[#fec6d4]/90 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
