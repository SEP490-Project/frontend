import { FaBars, FaAngleDown, FaPowerOff } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/libs/hooks/useAuth";
import { logout } from "@/libs/stores/authentManager/thunk";
import { useAppDispatch } from "@/libs/stores";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard } from "lucide-react";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();

  const getInitials = (name: any) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part: any) => part[0].toUpperCase())
      .join("");
  };

  const handleLogout = async () => {
    await dispatch(logout());
    window.location.href = "/";
  };

  return (
    <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-50">
      <div className="relative max-w-7xl mx-auto flex items-center justify-between">
        <button type="button" onClick={() => navigate("/")} className="flex items-center">
          <img src="/pink.png" alt="B-ShowSell Logo" className="h-16 w-auto" />
        </button>

        <nav className="absolute hidden lg:flex items-center justify-center w-full space-x-10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium"
          >
            HOME
          </button>
          <button
            type="button"
            onClick={() => navigate("/about-app")}
            className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium"
          >
            ABOUT APP
          </button>
          <button
            type="button"
            onClick={() => navigate("/about-us")}
            className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium"
          >
            ABOUT US
          </button>
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium"
          >
            BLOG
          </button>
          <button
            type="button"
            onClick={() => navigate("/order-tracking")}
            className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium"
          >
            ORDER TRACKING
          </button>
        </nav>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 md:px-3 py-1 rounded hover:bg-gray-100 transition">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border-2 border-primary shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-primary bg-gray-200 text-gray-600 flex items-center justify-center font-semibold shadow-sm">
                      {getInitials(user?.username)}
                    </div>
                  )}
                  <span className="hidden md:inline text-gray-800 font-semibold text-base">
                    {user?.username}
                  </span>
                  <FaAngleDown size={16} className="text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 animate-in slide-in-from-top-2 fade-in-0 duration-200 rounded-xl shadow-lg border border-gray-100 bg-white"
              >
                {user?.role !== "CUSTOMER" && (
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => navigate("/manage")}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                    >
                      <LayoutDashboard size={18} className="mr-2" />
                      <span>Dashboard</span>
                    </button>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 "
                  >
                    <FaPowerOff size={18} />
                    <span>Logout</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium"
            >
              LOGIN
            </button>
          )}

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <FaBars className="w-6 h-6 text-[#383838]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] ml-2">
              <nav className="flex flex-col space-y-6 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/about-app")}
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  About App
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/about-us")}
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/blog")}
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  Blog
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/order-tracking")}
                  className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                >
                  Order Tracking
                </button>
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[#383838] hover:text-[#fec6d4] transition-colors font-medium text-lg"
                  >
                    Login
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
