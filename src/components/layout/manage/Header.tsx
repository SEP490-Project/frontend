import React, { useState } from "react";
import {
  FaAngleDown,
  FaRegBell,
  FaRegUser,
  FaArrowRightToBracket,
  FaIndent,
  FaOutdent,
} from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NavLink } from "react-router-dom";
interface HeaderProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleMobileSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  collapsed = false,
  onToggleCollapse,
  onToggleMobileSidebar,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const user = {
    name: "Nguyen Van A",
    avatar: "https://i.pravatar.cc/40?img=3",
  };

  const notifications = [
    { id: 1, text: "Bạn có lịch họp lúc 10h sáng nay" },
    { id: 2, text: "Hệ thống sẽ bảo trì lúc 23h" },
    { id: 3, text: "Tin nhắn mới từ Admin" },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6 py-3 sticky top-0 z-40">
        {/* Left section */}
        <div className="flex items-center">
          {/* Collapse button (desktop only) */}
          <div className="hidden md:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded hover:bg-gray-100 transition focus:outline-none mr-4"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? (
                    <FaIndent size={24} className="text-gray-600" />
                  ) : (
                    <FaOutdent size={24} className="text-gray-500" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>{collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}</TooltipContent>
            </Tooltip>
          </div>

          {/* Sidebar toggle (mobile only) */}
          <div className="md:hidden">
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 rounded hover:bg-gray-100 transition"
              aria-label="Open sidebar"
            >
              <FaIndent size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* User dropdown */}
          <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 md:px-3 py-1 rounded hover:bg-gray-100 transition">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border-2 border-primary shadow-sm"
                />
                <span className="hidden md:inline text-gray-800 font-semibold text-base">
                  {user.name}
                </span>
                <span
                  className={`transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
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
                <NavLink
                  to="/manage/account"
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <FaRegUser size={18} className="text-primary" />
                  <span>Account</span>
                </NavLink>
              </DropdownMenuItem>
              <div className="border-t mx-4 my-2" />
              <DropdownMenuItem asChild>
                <button className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50">
                  <FaArrowRightToBracket size={18} />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative p-2 rounded hover:bg-gray-100 transition focus:outline-none"
                    aria-label="Notifications"
                  >
                    <FaRegBell size={22} className="text-gray-500" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1 border border-white shadow">
                      {notifications.length}
                    </span>
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Thông báo</TooltipContent>
            </Tooltip>

            <DropdownMenuContent
              align="end"
              className="w-80 max-h-96 overflow-y-auto animate-in slide-in-from-top-5 fade-in-0 duration-200 rounded-xl shadow-lg border border-gray-100 bg-white"
            >
              <div className="px-5 py-3 text-base font-bold text-gray-800 border-b flex items-center gap-2">
                <FaRegBell size={18} className="text-primary" />
                Thông báo
              </div>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <FaRegBell size={32} className="mb-2" />
                  <span className="text-base">Không có thông báo mới</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="px-5 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="font-medium text-gray-800 text-sm">{n.text}</div>
                    <div className="text-xs text-gray-400 mt-1">Vừa xong</div>
                  </DropdownMenuItem>
                ))
              )}
              <div className="border-t mt-2" />
              <DropdownMenuItem asChild>
                <NavLink
                  to="/manage/notification"
                  className="block w-full text-center text-primary font-semibold py-3 hover:underline"
                >
                  Xem tất cả thông báo
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;
