import React, { useState, useEffect } from "react";
import {
  FaAngleDown,
  FaRegBell,
  FaRegUser,
  FaPowerOff,
  FaIndent,
  FaOutdent,
  FaCircle,
} from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/libs/hooks/useAuth";
import { logout } from "@/libs/stores/authentManager/thunk";
import { notifications as getNotifications } from "@/libs/stores/notificationManager/thunk";
import { useNotificationStore } from "@/libs/hooks/useNotification";
import { useNotificationContext } from "@/libs/contexts/NotificationContext";
import { defaultAvatarByName } from "@/libs/helper/default-avatar";
import { useAppDispatch } from "@/libs/stores";

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
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const { notifications } = useNotificationStore();

  const { unreadCount, markAsRead } = useNotificationContext();

  useEffect(() => {
    if (user?.id) {
      dispatch(getNotifications({ page: 1, limit: 10, user_id: user.id, type: "IN_APP" }));
    }
  }, [dispatch, user?.id]);

  const displayedNotifications = notifications.slice(0, 5);

  const handleLogout = async () => {
    await dispatch(logout());
    window.location.href = "/login";
  };

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
  };

  return (
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
                  <FaIndent size={18} className="text-gray-600" />
                ) : (
                  <FaOutdent size={18} className="text-gray-500" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</TooltipContent>
          </Tooltip>
        </div>

        {/* Sidebar toggle (mobile only) */}
        <div className="md:hidden">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded hover:bg-gray-100 transition"
            aria-label="Open sidebar"
          >
            <FaIndent size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* User dropdown */}
        <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 md:px-3 py-1 rounded hover:bg-gray-100 transition">
                  {user?.avatar_url ? (
                    <img
                      src={user?.avatar_url}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border-2 border-primary shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full border-2 border-primary bg-gray-200 text-gray-600 flex items-center justify-center font-semibold shadow-sm">
                      {defaultAvatarByName(user?.username || "")}
                    </div>
                  )}
                  <span className="hidden md:inline text-gray-800 font-semibold text-base">
                    {user?.username}
                    <div className="text-[0.6rem] text-gray-400 flex justify-start">
                      {user?.role}
                    </div>
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
            </TooltipTrigger>
            <TooltipContent>Menu</TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="end"
            className="w-56 animate-in slide-in-from-top-2 fade-in-0 duration-200 rounded-xl shadow-lg border border-gray-100 bg-white"
          >
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50"
              >
                <FaPowerOff size={18} />
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
                  <FaRegBell size={18} className="text-gray-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1 min-w-[1.25rem] border border-white shadow animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <DropdownMenuContent
            align="end"
            // 1. Changed: Removed overflow-y-auto, added flex flex-col
            className="w-80 h-[30rem] flex flex-col animate-in slide-in-from-top-5 fade-in-0 duration-200 rounded-xl shadow-lg border border-gray-100 bg-white p-0 overflow-x-hidden"
          >
            {/* HEADER: Naturally stays at the top */}
            <div className="px-5 py-3 text-base font-bold text-gray-800 border-b flex items-center justify-between bg-white rounded-t-xl shrink-0">
              <div className="flex items-center gap-2">
                <FaRegBell size={18} className="text-primary" />
                Notifications
              </div>
              {unreadCount > 0 && (
                <span className="text-xs font-normal text-gray-500">{unreadCount} unread</span>
              )}
            </div>

            {/* BODY: This wrapper handles the scrolling */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {displayedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <FaRegBell size={18} className="mb-2" />
                  <span className="text-base">No new notifications</span>
                </div>
              ) : (
                displayedNotifications.map((n) => {
                  const isRead = n.is_read;
                  return (
                    <DropdownMenuItem
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id, n.is_read)}
                      className={`px-5 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition-colors focus:bg-gray-50
                ${isRead ? "opacity-60 bg-white" : "bg-blue-50/30"}
              `}
                    >
                      <div className="flex gap-3 w-full">
                        <div className="mt-1 shrink-0">
                          {!isRead && <FaCircle className="w-2 h-2 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div
                            className={`text-sm truncate ${isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}
                          >
                            {n.content_data.title}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed break-words">
                            {n.content_data.body}
                          </div>
                          <div className="text-[10px] text-gray-400 pt-1">
                            {new Date(n.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>

            {/* FOOTER: Naturally stays at the bottom */}
            <div className="p-2 border-t bg-gray-50 rounded-b-xl shrink-0">
              <DropdownMenuItem asChild>
                <button
                  onClick={() => navigate("/manage/notification")}
                  className="w-full text-center text-primary text-sm font-semibold py-2 hover:bg-white rounded-md transition-colors focus:bg-white"
                >
                  View all notifications
                </button>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
