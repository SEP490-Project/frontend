import React from "react";
import { Button } from "@/components/ui/button";

const Homepage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold mb-4 text-purple-700 text-center">Welcome to Homepage</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        This is a modern homepage using Tailwind CSS & ShadcnUI.
      </p>
      <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">Get Started</Button>
    </div>
  );
};

export default Homepage;
