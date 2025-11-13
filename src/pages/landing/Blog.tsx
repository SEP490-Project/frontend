import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

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
      image: "/gallery/lifestyle-1.jpg",
      title: "The Ultimate Morning Skincare Routine for Glowing Skin",
      author: "Dr. Emily Chen",
      date: "November 10, 2024",
      category: "Skincare",
      snippet:
        "Discover the perfect morning skincare routine that will leave your skin radiant and healthy. Our expert dermatologist shares professional tips and product recommendations for all skin types.",
      readTime: "5 min read",
    },
    {
      id: 2,
      image: "/gallery/lifestyle-1.jpg",
      title: "2024 Fall Makeup Trends: Bold Colors and Natural Glow",
      author: "Sarah Johnson",
      date: "November 8, 2024",
      category: "Makeup",
      snippet:
        "Explore this season's hottest makeup trends, from bold berry lips to dewy skin finishes. Get inspired by runway looks adapted for everyday wear.",
      readTime: "4 min read",
    },
    {
      id: 3,
      image: "/gallery/lifestyle-1.jpg",
      title: "Sustainable Beauty: Making Eco-Friendly Choices",
      author: "Green Beauty Expert",
      date: "November 6, 2024",
      category: "Lifestyle",
      snippet:
        "Learn how to build a sustainable beauty routine that's kind to both your skin and the environment. Discover eco-friendly brands and packaging alternatives.",
      readTime: "6 min read",
    },
    {
      id: 4,
      image: "/gallery/lifestyle-1.jpg",
      title: "Winter Hair Care: Protecting Your Hair in Cold Weather",
      author: "Michael Rodriguez",
      date: "November 4, 2024",
      category: "Hair Care",
      snippet:
        "Cold weather can be harsh on your hair. Learn essential tips and treatments to keep your locks healthy, shiny, and protected throughout the winter months.",
      readTime: "4 min read",
    },
    {
      id: 5,
      image: "/gallery/lifestyle-1.jpg",
      title: "Anti-Aging Skincare: Science-Backed Ingredients That Work",
      author: "Dr. Lisa Park",
      date: "November 2, 2024",
      category: "Skincare",
      snippet:
        "Explore scientifically-proven anti-aging ingredients and learn how to incorporate them into your routine for visible results. Expert advice on retinoids, peptides, and more.",
      readTime: "7 min read",
    },
    {
      id: 6,
      image: "/gallery/lifestyle-1.jpg",
      title: "Beauty from Within: Nutrition for Healthy Skin",
      author: "Nutritionist Amy Wilson",
      date: "October 30, 2024",
      category: "Wellness",
      snippet:
        "Discover how nutrition impacts your skin health. Learn about beauty-boosting foods, supplements, and lifestyle habits for a natural glow from the inside out.",
      readTime: "5 min read",
    },
    {
      id: 7,
      image: "/gallery/lifestyle-1.jpg",
      title: "How to Choose Your Signature Fragrance",
      author: "Perfume Expert",
      date: "October 28, 2024",
      category: "Fragrance",
      snippet:
        "Finding your perfect scent can be overwhelming. Our fragrance expert breaks down fragrance families, notes, and tips for selecting a signature scent.",
      readTime: "4 min read",
    },
    {
      id: 8,
      image: "/gallery/lifestyle-1.jpg",
      title: "Men's Grooming Essentials: Building the Perfect Routine",
      author: "David Thompson",
      date: "October 26, 2024",
      category: "Men's Grooming",
      snippet:
        "A comprehensive guide to men's skincare and grooming. From basic cleansing to advanced treatments, everything you need for a polished appearance.",
      readTime: "6 min read",
    },
  ];

  const popularPosts = [
    { title: "10 Skincare Mistakes You're Probably Making", views: "15.2K views" },
    { title: "The Best Korean Beauty Products Under $20", views: "12.8K views" },
    { title: "How to Apply Foundation Like a Pro", views: "11.5K views" },
    { title: "Natural Remedies for Acne-Prone Skin", views: "10.3K views" },
  ];

  const categories = [
    "All Posts",
    "Skincare",
    "Makeup",
    "Hair Care",
    "Lifestyle",
    "Wellness",
    "Fragrance",
    "Men's Grooming",
  ];

  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-[#383838] mb-6">
                Our <span className="text-[#fec6d4]">Blog</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Beauty tips, lifestyle insights, and expert advice to help you look and feel your
                best
              </p>
              <div className="max-w-md mx-auto relative">
                <Input
                  placeholder="Search articles..."
                  className="pl-12 pr-4 py-3 rounded-full border-2 border-[#fec6d4] focus:border-[#feb2c5]"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Category Filter */}
              <motion.div className="mb-8" {...fadeInUp}>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? "default" : "outline"}
                      className={
                        index === 0
                          ? "bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838]"
                          : "border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4]"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Blog Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                {currentPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    variants={fadeInUp}
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#fec6d4] text-[#383838] px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <User className="w-4 h-4 mr-1" />
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#383838] mb-3 line-clamp-2 hover:text-[#fec6d4] transition-colors cursor-pointer">
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

              {/* Pagination */}
              <motion.div className="flex justify-center items-center gap-4" {...fadeInUp}>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4]"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                      className={
                        currentPage === i + 1
                          ? "bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838]"
                          : "border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4]"
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4]"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="space-y-8"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                {/* Popular Posts */}
                <motion.div className="bg-white p-6 rounded-2xl shadow-lg" variants={fadeInUp}>
                  <h3 className="text-2xl font-bold text-[#383838] mb-6">Popular Posts</h3>
                  <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-semibold text-[#383838] hover:text-[#fec6d4] transition-colors cursor-pointer mb-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-500">{post.views}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Newsletter Signup */}
                <motion.div
                  className="bg-gradient-to-br from-[#fec6d4] to-[#feb2c5] p-6 rounded-2xl text-white"
                  variants={fadeInUp}
                >
                  <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                  <p className="mb-4">
                    Get the latest beauty tips and trends delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input
                      placeholder="Your email address"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                    <Button className="bg-white text-[#383838] hover:bg-gray-100 w-full font-semibold">
                      Subscribe Now
                    </Button>
                  </div>
                </motion.div>

                {/* Categories Widget */}
                <motion.div className="bg-white p-6 rounded-2xl shadow-lg" variants={fadeInUp}>
                  <h3 className="text-2xl font-bold text-[#383838] mb-6">Categories</h3>
                  <div className="space-y-2">
                    {categories.slice(1).map((category, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-[#383838] hover:text-[#fec6d4] transition-colors cursor-pointer">
                          {category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.floor(Math.random() * 20) + 5}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

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
                Want to explore more?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Download our app for exclusive content, personalized recommendations, and seamless
                beauty shopping experience
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

export default Blog;
