import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/libs/stores";
import { usePostedContent } from "@/libs/hooks/useContentPosted";
import { postedContents } from "@/libs/stores/contentPostedManager/thunk";
import type { ListContent } from "@/libs/types/content";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<ListContent[]>([]);
  const postsPerPage = 9;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { postedContents: contents, loading, pagination } = usePostedContent();

  useEffect(() => {
    dispatch(postedContents({ page: 1, limit: postsPerPage }));
  }, [dispatch]);

  useEffect(() => {
    if (contents) {
      if (currentPage === 1) {
        setAllPosts(contents);
      } else {
        setAllPosts((prev) => [...prev, ...contents]);
      }
    }
  }, [contents, currentPage]);

  const loadMore = () => {
    if (pagination?.has_next && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(postedContents({ page: nextPage, limit: postsPerPage }));
    }
  };

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

  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get unique categories from blog tags
  const getAllCategories = () => {
    const categories = new Set(["All Posts"]);
    allPosts.forEach((post) => {
      if (post.blog?.tags) {
        post.blog.tags.forEach((tag: string) => categories.add(tag));
      }
    });
    return Array.from(categories);
  };

  const categories = getAllCategories();

  // Get popular posts (first 4 posts for now)
  const popularPosts = allPosts.slice(0, 4).map((post) => ({
    title: post.title,
    views: `${Math.floor(Math.random() * 20) + 5}K views`, // Mock views for now
  }));

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
              {loading && allPosts.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-xl text-gray-500">Loading blog posts...</div>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  {allPosts.map((post: ListContent) => (
                    <motion.article
                      key={post.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                      variants={fadeInUp}
                      whileHover={{ y: -10 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.thumbnail_url}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#fec6d4] text-[#383838] px-3 py-1 rounded-full text-sm font-medium">
                            {post.blog?.tags?.[0] || post.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <User className="w-4 h-4 mr-1" />
                          <span>{post.blog?.author?.username || "Anonymous"}</span>
                          <span className="mx-2">•</span>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(post.publish_date || post.created_at)}</span>
                          {post.blog?.read_time && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{post.blog.read_time} min read</span>
                            </>
                          )}
                        </div>
                        <h3
                          className="text-xl font-bold text-[#383838] mb-3 line-clamp-2 hover:text-[#fec6d4] transition-colors cursor-pointer"
                          onClick={() => navigate(`/blog/${post.id}`)}
                        >
                          {post.title}
                        </h3>
                        {/* <p className="text-gray-600 mb-4 line-clamp-3">{post.blog?.excerpt}</p> */}
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/blog/${post.id}`)}
                          className="border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4] w-full"
                        >
                          Read More
                        </Button>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              )}

              {/* Load More */}
              {pagination?.has_next && (
                <motion.div className="flex justify-center" {...fadeInUp}>
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838] px-8 py-3 rounded-full"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </motion.div>
              )}
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
