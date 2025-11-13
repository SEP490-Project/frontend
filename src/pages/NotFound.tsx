import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaHouse, FaArrowLeft } from "react-icons/fa6";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const gifUrl = "https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border border-border bg-card">
          <CardContent className="p-8 text-center">
            {/* 🐾 Fun animated GIF */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6 flex justify-center"
            >
              <img
                src={gifUrl}
                alt="Funny 404 cat"
                className="w-40 h-40 rounded-full object-cover border-4 border-primary/20 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://media.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif";
                }}
              />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
            </motion.div>

            {/* Subtitle and message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl md:text-4xl font-semibold text-foreground mb-4">
                Oops! Page Not Found 😿
              </h2>

              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Looks like you’ve wandered off into the void. Don’t worry — even the cat got lost.
                Let’s get you back home!
              </p>
            </motion.div>

            {/* Navigation buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/25"
              >
                <Link to="/">
                  <FaHouse className="mr-2" />
                  Go Home
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/25"
              >
                <FaArrowLeft className="mr-2" />
                Go Back
              </Button>
            </motion.div>

            {/* Cute quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8"
            >
              <p className="text-muted-foreground text-sm italic">
                “Even the cat got lost — you’re not alone out here 😸”
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decorative floating circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary/20 rounded-full -z-10"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-accent/30 rounded-full -z-10"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute top-1/2 right-1/3 w-32 h-32 bg-muted/20 rounded-full -z-10"
      />
    </div>
  );
};

export default NotFound;
