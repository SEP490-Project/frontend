import React from "react";
import { AiOutlineBell, AiOutlineUser, AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";

interface HeaderProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed = false, onToggleCollapse }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  // Giả lập thông tin user
  const user = {
    name: "Nguyen Van A",
    avatar: "https://i.pravatar.cc/40?img=3",
  };

  // Giả lập thông báo
  const notifications = [
    { id: 1, text: "Bạn có lịch họp lúc 10h sáng nay" },
    { id: 2, text: "Hệ thống sẽ bảo trì lúc 23h" },
    { id: 3, text: "Tin nhắn mới từ Admin" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-3 sticky top-0 z-30">
      {/* Left section - Toggle button */}
      <div className="flex items-center">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded hover:bg-gray-100 transition focus:outline-none mr-4"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <AiOutlineMenuUnfold size={24} className="text-gray-600" />
          ) : (
            <AiOutlineMenuFold size={24} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* User dropdown */}
        <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition focus:outline-none">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full border-2 border-primary shadow-sm"
              />
              <span className="hidden md:inline text-gray-800 font-semibold text-base">
                {user.name}
              </span>
              <span
                className={`transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
              >
                <FaAngleDown size={16} className="text-gray-500" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 animate-in slide-in-from-top-2 fade-in-0 duration-200 rounded-xl shadow-lg border border-gray-100 bg-white"
          >
            <div className="px-4 py-3 flex items-center gap-3 border-b">
              <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border" />
              <div>
                <div className="font-semibold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-400">Admin</div>
              </div>
            </div>
            <DropdownMenuItem asChild>
              <a
                href="/account"
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <AiOutlineUser size={18} className="text-primary" />
                <span>Account</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href="/settings"
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <AiOutlineSetting size={18} className="text-primary" />
                <span>Settings</span>
              </a>
            </DropdownMenuItem>
            <div className="border-t mx-4 my-2" />
            <DropdownMenuItem asChild>
              <button className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50">
                <AiOutlineLogout size={18} />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications - chuyên nghiệp */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative p-2 rounded hover:bg-gray-100 transition focus:outline-none"
              aria-label="Notifications"
            >
              <AiOutlineBell
                size={22}
                className="text-gray-500 group-hover:text-primary transition"
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1 border border-white shadow">
                {notifications.length}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 max-h-96 overflow-y-auto animate-in slide-in-from-top-5 fade-in-0 duration-200 rounded-xl shadow-lg border border-gray-100 bg-white"
          >
            <div className="px-5 py-3 text-base font-bold text-gray-800 border-b flex items-center gap-2">
              <AiOutlineBell size={18} className="text-primary" />
              Thông báo
            </div>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AiOutlineBell size={32} className="mb-2" />
                <span className="text-base">Không có thông báo mới</span>
              </div>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="px-5 py-3 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-gray-800 text-sm">{n.text}</div>
                  <div className="text-xs text-gray-400 mt-1">Vừa xong</div>
                </DropdownMenuItem>
              ))
            )}
            <div className="border-t mt-2" />
            <DropdownMenuItem asChild>
              <a
                href="/notifications"
                className="block w-full text-center text-primary font-semibold py-3 hover:underline"
              >
                Xem tất cả thông báo
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
