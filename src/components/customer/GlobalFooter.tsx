import { Facebook, Instagram, Send, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GlobalFooter = () => {
  return (
    <footer className="bg-[#2a2a2a] text-white">
      {/* Social Media Icons */}
      <div className="border-b border-gray-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-white hover:text-[#fec6d4] transition-colors">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-white hover:text-[#fec6d4] transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-white hover:text-[#fec6d4] transition-colors">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-white hover:text-[#fec6d4] transition-colors">
              <Send size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4 text-[#FEC6D4]">B-ShowSell</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Discover nature's beauty with our natural care products.
            </p>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>+ 38 050 123 45 67</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✉️</span>
                <span>bshowsell@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Kyiv, Ukraine</span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">HELP</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-[#fec6d4] transition-colors">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#fec6d4] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#fec6d4] transition-colors">
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>

          {/* My Account Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">MY ACCOUNT</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-[#fec6d4] transition-colors">
                  Addresses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#fec6d4] transition-colors">
                  Order Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#fec6d4] transition-colors">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">CUSTOMER CARE</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-[#fec6d4] transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#fec6d4] transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">SIGN UP FOR EMAILS</h4>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Stay informed, subscribe to our newsletter now!
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Email"
                className="bg-white text-black placeholder:text-gray-500 border-none"
              />
              <Button className="w-full bg-transparent border border-gray-500 text-white hover:bg-[#b0a6bd] hover:border-[#b0a6bd] transition-colors">
                Subscribe →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 B-ShowSell</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a href="#" className="hover:text-[#fec6d4] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#fec6d4] transition-colors">
                Terms And Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default GlobalFooter;
