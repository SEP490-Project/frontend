import { Outlet, useNavigate } from "react-router-dom";
// import { FaHome } from "react-icons/fa";
import LoginBanner from "@/assets/images/beauty-login-banner.jpg";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AuthenticationLayout = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-linear-[90deg,_#FFC7E2,_#FC9DEB] flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[90vh] w-[90%] rounded-2xl shadow-lg overflow-hidden bg-white">
          <div className="hidden md:block">
            <img
              src={LoginBanner}
              alt="Login Image"
              className="w-full h-full object-cover hidden md:block"
            />
          </div>
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Button variant={"outline"} color="primary" onClick={() => navigate("/")}>
                <Home className="text-primary" />
                <span className="ml-2 text-primary font-semibold">Home</span>
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center px-10 lg:px-20 min-h-[90vh]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
