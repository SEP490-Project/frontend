import React from "react";
import { AiOutlineBell, AiOutlineUser, AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  // Giả lập thông tin user
  const user = {
    name: "Nguyen Van A",
    avatar: "https://i.pravatar.cc/40?img=3",
  };
  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4">
      {/* Logo và các tab điều hướng */}
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-gray-800">My App</h1>
      </div>
      {/* Khu vực bên phải: Notify + User */}
      <div className="flex items-center gap-6">
        {/* User info + dropdown-menu shadcn */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition">
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              <span className="hidden sm:inline text-gray-700 font-medium">{user.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <a href="/profile" className="flex items-center gap-2 w-full">
                <AiOutlineUser size={18} className="text-gray-500" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/settings" className="flex items-center gap-2 w-full">
                <AiOutlineSetting size={18} className="text-gray-500" />
                <span>Settings</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button className="flex items-center gap-2 w-full text-red-500">
                <AiOutlineLogout size={18} />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Notify icon */}
        <button className="relative" aria-label="Notifications">
          <AiOutlineBell size={24} className="text-gray-500 hover:text-primary transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
