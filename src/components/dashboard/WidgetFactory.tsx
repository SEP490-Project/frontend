import KPIWidget from "./KPIWidget";
import BarChartWidget from "./BarChartWidget";
import LineChartWidget from "./LineChartWidget";
import PieChartWidget from "./PieChartWidget";
import TableWidget from "./TableWidget";

import {
  FaUser,
  FaMoneyBillWave,
  FaChartLine,
  FaBullhorn,
  FaClipboardList,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaTasks,
} from "react-icons/fa";
import { MdCampaign, MdPendingActions } from "react-icons/md";

interface WidgetConfig {
  type: string;
  title: string;
  key: string;
}

interface Props {
  config: WidgetConfig;
  data: any;
}

export default function WidgetFactory({ config, data }: Props) {
  // Map key → icon + màu
  const iconMap: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    totalUsers: {
      icon: <FaUser size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    totalRevenue: {
      icon: <FaMoneyBillWave size={20} />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    activeBrands: {
      icon: <FaBullhorn size={20} />,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    activeCampaigns: {
      icon: <MdCampaign size={20} />,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    finishedCampaigns: {
      icon: <FaCheckCircle size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    monthlyRevenue: {
      icon: <FaChartLine size={20} />,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    totalPosts: {
      icon: <FaClipboardList size={20} />,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    totalViews: {
      icon: <FaChartLine size={20} />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    totalEngagement: {
      icon: <FaTasks size={20} />,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    avgCTR: {
      icon: <FaChartLine size={20} />,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
    totalOrders: {
      icon: <FaBoxOpen size={20} />,
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
    todayRevenue: {
      icon: <FaMoneyBillWave size={20} />,
      color: "text-green-700",
      bg: "bg-green-100",
    },
    bestSeller: {
      icon: <FaBullhorn size={20} />,
      color: "text-purple-700",
      bg: "bg-purple-100",
    },
    campaigns: {
      icon: <MdCampaign size={20} />,
      color: "text-sky-600",
      bg: "bg-sky-100",
    },
    pendingPayments: {
      icon: <MdPendingActions size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    lastInvoice: {
      icon: <FaFileInvoiceDollar size={20} />,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
  };

  switch (config.type) {
    case "KPI": {
      const iconConfig = iconMap[config.key];
      return (
        <KPIWidget
          title={config.title}
          data={data}
          icon={iconConfig?.icon}
          iconColor={iconConfig?.color}
          iconBg={iconConfig?.bg}
          // Thêm id cho KPIWidget
          id={`kpi-widget-${config.key}`}
        />
      );
    }
    case "BarChart":
      return <BarChartWidget title={config.title} data={data} />;
    case "LineChart":
      return <LineChartWidget title={config.title} data={data} />;
    case "PieChart":
      return <PieChartWidget title={config.title} data={data} />;
    case "Table":
      return <TableWidget title={config.title} data={data} />;
    default:
      return null;
  }
}
