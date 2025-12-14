import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaUser, FaPhone, FaEnvelope, FaIdBadge, FaArrowRightFromBracket } from "react-icons/fa6";
import { type RootState, useAppDispatch } from "@/libs/stores";
import { useSelector } from "react-redux";
import { logout } from "@/libs/stores/authentManager/thunk";
import { useNavigate } from "react-router-dom";

const SalesProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state?.manageAuthen?.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/sales-app/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 pb-6">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="px-4 pt-3 pb-3">
          <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your sales account information</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <Card className="border-none shadow-sm rounded-2xl bg-white/90">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-slate-100 flex items-center justify-center shadow-sm">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-8 h-8 text-slate-400" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-slate-900 truncate">
                  {user?.username || "Sales Staff"}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-[11px] px-2 py-0.5 rounded-full">
                    {user?.role || "SALES_STAFF"}
                  </Badge>
                  <span className="text-[11px] text-slate-500">
                    ID: {user?.id?.slice(0, 10) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl bg-white/95">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <FaIdBadge className="w-4 h-4 text-slate-500" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FaEnvelope className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-slate-800 truncate">
                  {user?.email || "No email available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FaPhone className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm text-slate-800">Phone number not available</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FaIdBadge className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Employee ID</p>
                <p className="text-sm text-slate-800">{user?.id?.slice(0, 8) || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full justify-center h-10 rounded-xl border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          onClick={handleLogout}
        >
          <FaArrowRightFromBracket className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        <Card className="border-none bg-transparent shadow-none">
          <CardContent className="p-3 text-center text-[11px] text-slate-400">
            <p>Sales PWA v1.0.0</p>
            <p>© 2025 Sales Management System</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesProfile;
