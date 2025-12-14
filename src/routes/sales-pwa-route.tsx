import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/libs/hooks/useAuth";
import { useIsStandalone } from "@/libs/hooks/useIsStandalone";
import { FaMobileScreenButton } from "react-icons/fa6";

const SalesPwaRoute: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const isStandalone = useIsStandalone();

  if (!isAuthenticated) {
    return <Navigate to="/sales-app/login" replace />;
  }

  if (role !== "SALES_STAFF") {
    return <Navigate to="/404" replace />;
  }

  if (!isStandalone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
            <FaMobileScreenButton className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            This app is only available on mobile
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Please open this page from the installed Sales app or from the shortcut added to your
            home screen.
          </p>

          <div className="bg-white border border-slate-100 rounded-2xl p-4 text-left shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-700">How to use on your phone:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600">
              <li>Open this link in your mobile browser.</li>
              <li>
                Add the app to your home screen (<span className="italic">Add to Home Screen</span>
                ).
              </li>
              <li>Launch the app again from the home screen icon to use all features.</li>
            </ol>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            If you are currently on a desktop device, please try again on your phone.
          </p>
        </div>
      </div>
    );
  }

  // Valid user & standalone mode → render child routes
  return <Outlet />;
};

export default SalesPwaRoute;
