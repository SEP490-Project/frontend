import React from "react";
import { toast } from "sonner";
import {
  FaRegBell,
  FaCircleCheck,
  FaCircleXmark,
  FaCircleInfo,
  FaXmark,
  FaArrowRight,
} from "react-icons/fa6";
import { cn } from "@/libs/utils";

export interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  type?: string;
  created_at?: string;
  data?: any;
}

interface NotificationToastProps {
  t: string | number;
  payload: NotificationPayload;
  onNavigate?: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ t, payload, onNavigate }) => {
  const { title, body, type, created_at } = payload;

  const getStyleConfig = (type?: string) => {
    switch (type?.toUpperCase()) {
      case "SUCCESS":
        return {
          icon: <FaCircleCheck className="h-5 w-5" />,
          borderColor: "border-l-emerald-500",
          iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          accentColor: "text-emerald-600 hover:text-emerald-700",
        };
      case "ERROR":
        return {
          icon: <FaCircleXmark className="h-5 w-5" />,
          borderColor: "border-l-red-500",
          iconBg: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          accentColor: "text-red-600 hover:text-red-700",
        };
      case "WARN":
        return {
          icon: <FaCircleInfo className="h-5 w-5" />,
          borderColor: "border-l-amber-500",
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-400",
          accentColor: "text-amber-600 hover:text-amber-700",
        };
      default: // "INFO" and others
        return {
          icon: <FaRegBell className="h-5 w-5" />,
          borderColor: "border-l-primary",
          iconBg: "bg-primary/10",
          iconColor: "text-primary",
          accentColor: "text-primary hover:text-primary/80",
        };
    }
  };

  const config = getStyleConfig(type);

  const handleNavigateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.dismiss(t);
    if (onNavigate) {
      onNavigate(payload.id);
    }
  };

  const handleCardClick = () => {
    toast.dismiss(t);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.dismiss(t);
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        // Layout & Structure
        "relative w-full max-w-md flex overflow-hidden",
        "pl-4 pr-12 py-4 rounded-xl cursor-pointer",

        // Background & Border
        "bg-card border border-border",
        config.borderColor,
        "border-l-4",

        // Hover & Animation Effects
        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        "transition-all duration-200 ease-out",
        "group",
      )}
    >
      {/* Icon Section */}
      <div className="flex-shrink-0 mr-3">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            "transition-transform duration-200 group-hover:scale-110",
            config.iconBg,
            config.iconColor,
          )}
        >
          {config.icon}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground leading-tight mb-1 pr-2">{title}</h3>

        <p className="text-sm text-muted-foreground leading-snug line-clamp-2 mb-2">{body}</p>

        {/* Footer: Timestamp + Action */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground/70">
            {created_at
              ? new Date(created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now"}
          </span>

          <button
            onClick={handleNavigateClick}
            className={cn(
              "flex items-center gap-1.5 font-medium",
              "px-2 py-1 rounded-md -mr-2",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-200",
              "hover:bg-accent/50",
              config.accentColor,
            )}
          >
            View <FaArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={cn(
          "absolute top-2 right-2",
          "p-1.5 rounded-md",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-muted/80",
          "transition-all duration-200",
          "opacity-0 group-hover:opacity-100",
        )}
        aria-label="Close notification"
      >
        <FaXmark className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default NotificationToast;
