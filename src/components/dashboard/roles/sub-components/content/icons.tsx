import {
  FaFacebookF,
  FaGlobe,
  FaFileAlt,
  FaVideo,
  FaNewspaper,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaBell,
  FaBullhorn,
  FaCalendarAlt,
  FaChartLine,
  FaTasks,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaTiktok,
} from "react-icons/fa";

// Helper to get channel icon by channel code
export const getChannelIcon = (channelCode: string) => {
  switch (channelCode?.toUpperCase()) {
    case "FACEBOOK":
      return <FaFacebookF className="text-blue-600" size={16} />;
    case "TIKTOK":
      return <FaTiktok className="text-gray-800" size={16} />;
    case "WEBSITE":
      return <FaGlobe className="text-green-600" size={16} />;
    default:
      return <FaFileAlt className="text-gray-600" size={16} />;
  }
};

// Helper to get content type icon
export const getContentTypeIcon = (type: string) => {
  switch (type?.toUpperCase()) {
    case "VIDEO":
      return <FaVideo className="text-purple-600" size={14} />;
    case "POST":
      return <FaNewspaper className="text-blue-600" size={14} />;
    default:
      return <FaFileAlt className="text-gray-600" size={14} />;
  }
};

// Helper to get growth arrow icon
export const getGrowthIcon = (status: "up" | "down" | "stable") => {
  switch (status) {
    case "up":
      return <FaArrowUp size={12} />;
    case "down":
      return <FaArrowDown size={12} />;
    default:
      return <FaMinus size={12} />;
  }
};

// Get icon based on category
export const getCategoryIcon = (category: string) => {
  switch (category?.toUpperCase()) {
    case "LOW_CTR":
      return <FaChartLine className="text-orange-500" size={10} />;
    case "CONTENT_REJECTED":
      return <FaFileAlt className="text-red-500" size={10} />;
    case "SCHEDULE_FAILED":
      return <FaCalendarAlt className="text-purple-500" size={10} />;
    case "MILESTONE_DEADLINE":
      return <FaTasks className="text-blue-500" size={10} />;
    case "CAMPAIGN":
      return <FaBullhorn className="text-green-500" size={10} />;
    default:
      return <FaBell className="text-gray-500" size={10} />;
  }
};

// Get icon based on alert type
export const getAlertTypeIcon = (type: string) => {
  switch (type?.toUpperCase()) {
    case "ERROR":
      return <FaTimesCircle className="text-red-500" size={12} />;
    case "WARNING":
      return <FaExclamationTriangle className="text-amber-500" size={12} />;
    case "INFO":
      return <FaInfoCircle className="text-blue-500" size={12} />;
    default:
      return <FaBell className="text-gray-500" size={12} />;
  }
};
