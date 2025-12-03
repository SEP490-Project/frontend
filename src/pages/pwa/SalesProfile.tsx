import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdBadge,
  FaGear,
  FaArrowRightFromBracket,
  FaCamera,
} from "react-icons/fa6";
import PWANavigation from "@/components/pwa/PWANavigation";
import { type RootState } from "@/libs/stores";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const SalesProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state?.manageAuthen?.user);

  const handleLogout = () => {
    // TODO: Implement logout functionality
    toast.success("Logged out successfully");
  };

  const handleEditProfile = () => {
    toast.info("Edit profile feature coming soon");
  };

  const handleChangePassword = () => {
    toast.info("Change password feature coming soon");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 h-7 w-7 p-0 rounded-full"
                  onClick={handleEditProfile}
                >
                  <FaCamera className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.username || "Sales Staff"}
                </h2>
                <Badge variant="secondary" className="mt-1">
                  {user?.role || "SALES_STAFF"}
                </Badge>
                <p className="text-sm text-gray-500 mt-1">ID: {user?.id?.slice(0, 8) || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FaIdBadge className="w-4 h-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <FaEnvelope className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{user?.email || "No email available"}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Phone number not available</span>
            </div>
            <div className="flex items-center gap-3">
              <FaIdBadge className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Employee ID: {user?.id?.slice(0, 8) || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FaGear className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleEditProfile}>
              <FaUser className="w-4 h-4 mr-3" />
              Edit Profile
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleChangePassword}
            >
              <FaGear className="w-4 h-4 mr-3" />
              Change Password
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <FaArrowRightFromBracket className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardContent className="p-4 text-center text-sm text-gray-500">
            <p>Sales PWA v1.0.0</p>
            <p>© 2025 Sales Management System</p>
          </CardContent>
        </Card>
      </div>

      {/* PWA Navigation */}
      <PWANavigation className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default SalesProfile;
