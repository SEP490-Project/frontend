"use client";

import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="bg-white px-4 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-[#fec6d4] text-xl font-semibold">B-ShowSell</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium">
            SHOP ALL
          </a>
          <a href="#" className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium">
            BESTSELLERS
          </a>
          <a href="#" className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium">
            COLLECTION
          </a>
          <a href="#" className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium">
            ABOUT US
          </a>
          <a href="#" className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium">
            BLOG
          </a>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-6">
          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="flex flex-col items-center group">
              <Search className="w-5 h-5 text-[#383838] group-hover:text-[#fec6d4] transition-colors" />
              <span className="text-xs text-[#383838] mt-1 group-hover:text-[#fec6d4] transition-colors">
                SEARCH
              </span>
            </button>
            <button className="flex flex-col items-center group">
              <User className="w-5 h-5 text-[#383838] group-hover:text-[#fec6d4] transition-colors" />
              <span className="text-xs text-[#383838] mt-1 group-hover:text-[#fec6d4] transition-colors">
                ACCOUNT
              </span>
            </button>
            <button className="flex flex-col items-center group">
              <ShoppingBag className="w-5 h-5 text-[#383838] group-hover:text-[#fec6d4] transition-colors" />
              <span className="text-xs text-[#383838] mt-1 group-hover:text-[#fec6d4] transition-colors">
                CART
              </span>
            </button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6 text-[#383838]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] ml-2">
              <nav className="flex flex-col space-y-6 mt-6">
                <a
                  href="#"
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  SHOP ALL
                </a>
                <a
                  href="#"
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  BESTSELLERS
                </a>
                <a
                  href="#"
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  COLLECTION
                </a>
                <a
                  href="#"
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  ABOUT US
                </a>
                <a
                  href="#"
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  BLOG
                </a>

                <div className="border-t pt-6 mt-6">
                  <div className="flex justify-around">
                    <button className="flex flex-col items-center">
                      <Search className="w-6 h-6 text-[#383838]" />
                      <span className="text-sm text-[#383838] mt-2">SEARCH</span>
                    </button>
                    <button className="flex flex-col items-center">
                      <User className="w-6 h-6 text-[#383838]" />
                      <span className="text-sm text-[#383838] mt-2">ACCOUNT</span>
                    </button>
                    <button className="flex flex-col items-center">
                      <ShoppingBag className="w-6 h-6 text-[#383838]" />
                      <span className="text-sm text-[#383838] mt-2">CART</span>
                    </button>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
