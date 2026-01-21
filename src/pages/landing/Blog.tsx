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

// Loading Skeleton Component
const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="flex items-center mb-3 space-x-2">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-2"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-2"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const BlogGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
    {Array.from({ length: 6 }).map((_, index) => (
      <BlogCardSkeleton key={index} />
    ))}
  </div>
);

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<ListContent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const postsPerPage = 9;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { postedContents: contents, loading, pagination } = usePostedContent();

  useEffect(() => {
    // Add performance logging to debug slow loading
    const startTime = Date.now();
    console.log("Starting to fetch blog posts...");
    setIsInitialLoading(true);

    // Optimized fetch with smaller limit for faster initial load
    dispatch(
      postedContents({
        page: 1,
        limit: postsPerPage,
        // You can add these params to optimize API response:
        // fields: 'id,title,thumbnail_url,publish_date,created_at,type,blog.tags,blog.author.username,blog.read_time'
      }),
    )
      .unwrap()
      .then(() => {
        const endTime = Date.now();
        console.log(`Blog posts loaded in ${endTime - startTime}ms`);

        // Performance recommendations logging
        if (endTime - startTime > 2000) {
          console.warn("Blog loading is slow (>2s). Consider:");
          console.warn("1. Adding pagination with smaller page sizes");
          console.warn("2. Implementing API caching");
          console.warn("3. Using field selection to reduce payload");
          console.warn("4. Adding database indexing for the query");
        }
      })
      .catch((error) => {
        console.error("Error loading blog posts:", error);
        setIsInitialLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    console.log("Contents updated:", {
      contents: contents?.length || 0,
      currentPage,
      allPosts: allPosts.length,
      loading,
      isInitialLoading,
    });

    if (contents) {
      if (currentPage === 1) {
        setAllPosts(contents);
        setIsInitialLoading(false); // Set initial loading to false only after we have data
        console.log("Initial posts set:", contents.length);
      } else {
        setAllPosts((prev) => [...prev, ...contents]);
        console.log(
          `Added ${contents.length} more posts, total: ${allPosts.length + contents.length}`,
        );
      }
    }
  }, [contents, currentPage]);

  const loadMore = () => {
    if (pagination?.has_next && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      console.log(`Loading page ${nextPage}...`);
      const startTime = Date.now();

      dispatch(postedContents({ page: nextPage, limit: postsPerPage }))
        .unwrap()
        .then(() => {
          const endTime = Date.now();
          console.log(`Page ${nextPage} loaded in ${endTime - startTime}ms`);
        })
        .catch((error) => {
          console.error(`Error loading page ${nextPage}:`, error);
        });
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

  // Filter posts based on search and category
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.blog?.tags &&
        post.blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory =
      selectedCategory === "All Posts" ||
      (post.blog?.tags && post.blog.tags.includes(selectedCategory)) ||
      post.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

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
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
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
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => handleCategorySelect(category)}
                      className={
                        selectedCategory === category
                          ? "bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838]"
                          : "border-[#fec6d4] text-[#383838] hover:bg-[#fec6d4]"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                {(searchTerm || selectedCategory !== "All Posts") && (
                  <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredPosts.length} of {allPosts.length} posts
                    {searchTerm && ` for "${searchTerm}"`}
                    {selectedCategory !== "All Posts" && ` in "${selectedCategory}"`}
                  </div>
                )}
              </motion.div>

              {/* Blog Grid */}
              {isInitialLoading ? (
                <BlogGridSkeleton />
              ) : filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-xl text-gray-500 mb-4">No blog posts found</div>
                  {(searchTerm || selectedCategory !== "All Posts") && (
                    <div className="text-gray-400">Try adjusting your search or filter</div>
                  )}
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  {filteredPosts.map((post: ListContent) => (
                    <motion.article
                      key={post.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                      variants={fadeInUp}
                      whileHover={{ y: -10 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.thumbnail_url || "/not-found-800x384.png"}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== window.location.origin + "/not-found-800x384.png") {
                              target.src = "/not-found-800x384.png";
                            }
                          }}
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

              {/* Loading more posts skeleton */}
              {loading && allPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {Array.from({ length: postsPerPage }).map((_, index) => (
                    <BlogCardSkeleton key={`loading-${index}`} />
                  ))}
                </div>
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
                  {isInitialLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-100 pb-4 last:border-b-0 animate-pulse"
                        >
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
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
                  )}
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
