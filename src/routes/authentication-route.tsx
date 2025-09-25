import { Outlet } from "react-router-dom";
import LoginBanner from "@/assets/images/beauty-login-banner.jpg";

export const AuthenticationRoute = () => {
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
          <div>
            <div className="flex items-center justify-center min-h-full px-10 lg:px-20">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
