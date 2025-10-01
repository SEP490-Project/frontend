import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { Settings, User, Mail, Phone, Clock, UserCheck } from "lucide-react";

// Import các component từ shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Kiểu dữ liệu mô phỏng cho User
interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role:
    | "ADMIN"
    | "MARKETING_STAFF"
    | "CONTENT_STAFF"
    | "SALES_STAFF"
    | "CUSTOMER"
    | "BRAND_PARTNER";
  createdAt: string;
  lastLogin: string | null;
  isActive: boolean;
  avatarUrl: string; // Thêm trường avatar để hiển thị
}

// Giả lập thông tin user dựa trên schema
const user: UserProfile = {
  username: "nguyenvana_user",
  email: "nguyenvana@example.com",
  fullName: "Nguyễn Văn A",
  phone: "+84 123 456 789",
  role: "ADMIN",
  createdAt: "2023-01-15T10:00:00Z",
  lastLogin: "2025-09-28T15:00:00Z",
  isActive: true,
  avatarUrl: "https://i.pravatar.cc/150?img=3",
};

// Hàm định dạng vai trò cho dễ đọc
const formatRole = (role: UserProfile["role"]) => {
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const AccountPage: React.FC = () => {
  const formattedRole = formatRole(user.role);

  // Component phụ để hiển thị một dòng thông tin
  const InfoRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
  }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
      <div className="text-primary dark:text-primary/80 flex-shrink-0">{icon}</div>
      <div className="flex flex-col min-w-0">
        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
          {label}
        </Label>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center p-4 sm:p-6 md:p-10 min-h-screen bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-3xl shadow-2xl dark:bg-gray-900 transition-all duration-300">
        <CardHeader className="text-center p-6 sm:p-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-primary/20 dark:border-primary/50 shadow-lg mb-4">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback className="text-2xl">{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-50">
              {user.fullName}
            </CardTitle>
            <CardDescription className="text-lg text-primary font-semibold mt-1">
              {formattedRole}
            </CardDescription>
            <p
              className={`text-sm mt-1 font-medium ${user.isActive ? "text-green-500" : "text-red-500"}`}
            >
              <UserCheck size={14} className="inline-block mr-1" />
              {user.isActive ? "Active" : "Inactive"} Account
            </p>
          </div>
        </CardHeader>

        <Separator className="dark:bg-gray-700" />

        <CardContent className="p-6 sm:p-8 grid gap-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 border-b pb-2 dark:border-gray-700">
            Personal Information
          </h3>

          {/* Thông tin cá nhân cơ bản - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <InfoRow icon={<User size={20} />} label="Username" value={user.username} />
            <InfoRow icon={<Mail size={20} />} label="Email Address" value={user.email} />
            <InfoRow icon={<Phone size={20} />} label="Phone Number" value={user.phone || "N/A"} />
          </div>

          <Separator className="my-2 dark:bg-gray-700" />

          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 border-b pb-2 dark:border-gray-700">
            Account Status
          </h3>

          {/* Thông tin thời gian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <InfoRow
              icon={<Clock size={20} />}
              label="Account Created"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
            <InfoRow
              icon={<Clock size={20} />}
              label="Last Login"
              value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 p-6 sm:p-8 pt-0">
          <Button
            className="flex-1 w-full"
            variant="default" // Sử dụng variant mặc định (primary)
            onClick={() => console.log("Navigate to Settings")}
          >
            <Settings size={18} className="mr-2" />
            Account Settings
          </Button>
          <Button
            className="flex-1 w-full"
            variant="destructive" // Variant màu đỏ cho hành động nguy hiểm
            onClick={() => console.log("Logout action")}
          >
            <AiOutlineLogout size={18} className="mr-2" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountPage;
