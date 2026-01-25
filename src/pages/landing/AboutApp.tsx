import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Bell, Star, Sparkles, BookOpen, ShoppingBag } from "lucide-react";

const AboutApp = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-[#fec6d4]" />,
      title: "Articles & Tips",
      description:
        "Access beauty lifestyle content, expert advice, and trending tips to enhance your natural glow.",
    },
    {
      icon: <Heart className="w-12 h-12 text-[#fec6d4]" />,
      title: "Personalized Recommendations",
      description:
        "Get tailored product suggestions and beauty routines based on your preferences and skin type.",
    },
    {
      icon: <Bell className="w-12 h-12 text-[#fec6d4]" />,
      title: "Push Notifications",
      description:
        "Stay updated with new blog posts, app updates, and exclusive beauty tips delivered directly to your device.",
    },
    {
      icon: <Star className="w-12 h-12 text-[#fec6d4]" />,
      title: "Product Reviews",
      description:
        "Read authentic reviews from beauty enthusiasts and share your own experiences with the community.",
    },
    {
      icon: <Sparkles className="w-12 h-12 text-[#fec6d4]" />,
      title: "Beauty Tutorials",
      description:
        "Follow step-by-step video tutorials and discover new techniques from professional makeup artists.",
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-[#fec6d4]" />,
      title: "Seamless Shopping",
      description:
        "Browse and shop your favorite beauty products with secure payments and fast delivery options.",
    },
  ];

  const screenshots = [
    {
      src: "/app-screenshots/home-screen.jpg",
      alt: "Home Screen",
    },
    {
      src: "/app-screenshots/blog-screen.jpg",
      alt: "Blog Reading",
    },
    {
      src: "/app-screenshots/product-screen.jpg",
      alt: "Product Browsing",
    },
    {
      src: "/app-screenshots/account-screen.jpg",
      alt: "User Profile",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-6 bg-gradient-to-br from-pink-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="text-center lg:text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-[#383838] mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Your Beauty <span className="text-[#fec6d4] block">Companion App</span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Read articles, explore tips, and shop conveniently via mobile. Everything you need
                  for your beauty journey in one place.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Button className="bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838] font-semibold px-8 py-4 rounded-full text-lg">
                    Download Now
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4] px-8 py-4 rounded-full text-lg"
                  >
                    View Features
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fec6d4] to-[#feb2c5] rounded-3xl blur-3xl opacity-30 scale-110"></div>
                  <img
                    src="/app-screenshots/home-screen.jpg"
                    alt="B-ShowSell Mobile App"
                    className="relative w-full max-w-md mx-auto drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#383838] mb-4">App Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover all the amazing features that make B-ShowSell your perfect beauty companion
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <motion.div
                    className="mb-6 flex justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#383838] mb-4 group-hover:text-[#fec6d4] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Screenshots Carousel */}
        <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#383838] mb-4">
                App Screenshots
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Take a look at our beautifully designed interface for reading blogs and browsing
                beauty tips
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {screenshots.map((screenshot, index) => (
                <motion.div
                  key={index}
                  className="relative group cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-lg">
                    <img
                      src={screenshot.src}
                      alt={screenshot.alt}
                      className="w-full aspect-[9/16] object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="text-center text-[#383838] font-medium mt-4 group-hover:text-[#fec6d4] transition-colors">
                    {screenshot.alt}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-[#fec6d4] to-[#feb2c5]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to start your beauty journey?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                "The app keeps me updated on beauty tips and helps me discover amazing products!" -
                Sarah M.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-[#383838] hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold">
                  <img src="/icons/app-store.png" alt="App Store" className="w-6 h-6 mr-2" />
                  Download on App Store
                </Button>
                <Button className="bg-white text-[#383838] hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold">
                  <img src="/icons/google-play.png" alt="Google Play" className="w-6 h-6 mr-2" />
                  Get it on Google Play
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutApp;
