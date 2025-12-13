import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Homepage = () => {
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

  const blogPosts = [
    {
      id: 1,
      image: "/gallery/lifestyle-4.jpg",
      title: "Natural Skincare Routines for Glowing Skin",
      snippet:
        "Discover the power of natural ingredients for healthy, radiant skin with our expert tips and product recommendations.",
      date: "Nov 10, 2024",
      author: "Beauty Expert",
    },
    {
      id: 2,
      image: "/gallery/lifestyle-5.jpg",
      title: "Top Beauty Trends This Season",
      snippet:
        "Stay ahead of the curve with the latest beauty trends and techniques that are taking the industry by storm.",
      date: "Nov 8, 2024",
      author: "Style Guru",
    },
    {
      id: 3,
      image: "/gallery/lifestyle-6.jpg",
      title: "Sustainable Beauty: Eco-Friendly Choices",
      snippet:
        "Learn how to make environmentally conscious beauty choices without compromising on quality or results.",
      date: "Nov 5, 2024",
      author: "Eco Beauty",
    },
  ];

  const galleryImages = [
    "/gallery/lifestyle-1.jpg",
    "/gallery/lifestyle-2.jpg",
    "/gallery/lifestyle-3.jpg",
    "/gallery/lifestyle-4.jpg",
    "/gallery/lifestyle-5.jpg",
    "/gallery/lifestyle-6.jpg",
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
                  Discover Beauty <span className="text-[#fec6d4] block">Naturally</span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Read our blog, explore tips, and download the app to shop.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Button className="bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838] font-semibold px-8 py-4 rounded-full text-lg">
                    Download App
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4] px-8 py-4 rounded-full text-lg"
                  >
                    Explore Blog
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative p-8">
                  <img
                    src="/hero/app-mockup.png"
                    alt="B-ShowSell App"
                    className="w-full max-w-lg mx-auto drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#383838] mb-4">From Our Blog</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover beauty tips, trends, and insights from our expert team
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {blogPosts.map((post) => (
                <motion.article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex text-sm text-gray-500 mb-3">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#383838] mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.snippet}</p>
                    <Button
                      variant="outline"
                      className="border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4] w-full"
                    >
                      Read More
                    </Button>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Button className="bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838] px-8 py-4 rounded-full text-lg">
                View All Blogs
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Bloom Beauty Gallery Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#383838] mb-4">
                Bloom Beauty Gallery
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our curated collection of lifestyle and beauty moments
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-square"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* App Download CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-[#fec6d4] to-[#feb2c5]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Experience the full range on our mobile app
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get personalized beauty recommendations, exclusive content, and seamless shopping
                experience
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

export default Homepage;
