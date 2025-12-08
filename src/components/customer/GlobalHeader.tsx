import { FaBars } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/libs/hooks/useAuth";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const getInitials = (name: any) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part: any) => part[0].toUpperCase())
      .join("");
  };

  return (
    <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button type="button" onClick={() => navigate("/")} className="flex items-center">
          <img src="/pink.png" alt="B-ShowSell Logo" className="h-16 w-auto" />
        </button>

        <nav className="hidden md:flex items-center space-x-10">
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
        </nav>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {user?.avatar ? (
                <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#b1b1b1] flex items-center justify-center text-white font-medium">
                  {getInitials(user?.username)}
                </div>
              )}
              <span className="text-[#383838] font-medium">{user?.username}</span>
            </div>
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
            <SheetTrigger asChild className="md:hidden">
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
