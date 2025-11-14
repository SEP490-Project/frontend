import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

const GlobalFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#fff6f8] py-10 px-6 mt-20 border-t border-pink-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <button type="button" onClick={() => navigate("/")}>
              <img src="/pink.png" alt="B-ShowSell Logo" className="h-16 mb-4" />
            </button>
            <p className="text-gray-600 text-sm leading-relaxed">
              B-ShowSell is a modern beauty and lifestyle platform. Download our mobile app to
              explore products, read blogs, and connect seamlessly.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#383838]">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="hover:text-[#fec6d4] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/about-app")}
                  className="hover:text-[#fec6d4] transition-colors"
                >
                  About App
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/about-us")}
                  className="hover:text-[#fec6d4] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/blog")}
                  className="hover:text-[#fec6d4] transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="hover:text-[#fec6d4] transition-colors"
                      >
                        Employees and Brands Login
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-sm text-gray-700 border border-gray-200 shadow-md">
                      For Employees and Brands use only.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#383838]">Get Our App</h4>
            <div className="flex flex-col">
              <a href="#" className="flex items-center py-2">
                <span className="text-sm text-[#383838] hover:text-[#fec6d4] transition-colors font-medium">
                  Download on App Store
                </span>
              </a>

              <a href="#" className="flex items-center py-2">
                <span className="text-sm text-[#383838] hover:text-[#fec6d4] transition-colors font-medium">
                  Get it on Google Play
                </span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#383838]">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: mrstrinh.work@gmail.com</li>
              <li>Phone: +84 123 456 789</li>
              <li>7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City, Viet Nam</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-100 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} B-ShowSell. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <button
              type="button"
              onClick={() => navigate("/privacy")}
              className="hover:text-[#fec6d4]"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => navigate("/terms")}
              className="hover:text-[#fec6d4]"
            >
              Terms of Use
            </button>
            <button
              type="button"
              onClick={() => navigate("/cookies")}
              className="hover:text-[#fec6d4]"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
