import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaHouse, FaArrowLeft } from "react-icons/fa6";
import { motion } from "framer-motion";

const Unauthorized: React.FC = () => {
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold text-destructive mb-4">403</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-4xl font-semibold text-foreground mb-4">
                Không có quyền truy cập
              </h2>

              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn
                cần truy cập.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/manage">
                  <FaHouse className="mr-2" />
                  Về Dashboard
                </Link>
              </Button>

              <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                <FaArrowLeft className="mr-2" />
                Quay lại
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
