import { useEffect } from "react";
import { useAppDispatch } from "@/libs/stores";
import { getAllConfigs } from "@/libs/stores/configManager/thunk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FaUser,
  FaFacebook,
  FaClock,
  FaLink,
  FaRobot,
  FaChartLine,
  FaFileContract,
  FaShieldHalved,
  FaRotate,
} from "react-icons/fa6";
import { FaTiktok, FaCog } from "react-icons/fa";
import { Settings, Check, X } from "lucide-react";
import { useConfig } from "@/libs/hooks/useConfig";

// Config item interface
interface ConfigItem {
  id: string;
  key: string;
  value_type: "NUMBER" | "STRING" | "ARRAY" | "BOOLEAN" | "TIPTAP_JSON" | "TEXTAREA" | "JSON";
  value: any;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Category configuration
const categoryConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  representative: {
    label: "Representative",
    icon: FaUser,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  facebook: {
    label: "Facebook",
    icon: FaFacebook,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  tik_tok: { label: "TikTok", icon: FaTiktok, color: "text-gray-900", bgColor: "bg-gray-100" },
  pay_os: {
    label: "Payment (PayOS)",
    icon: FaCog,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  system: { label: "System", icon: Settings, color: "text-purple-600", bgColor: "bg-purple-100" },
  ctr: {
    label: "CTR Aggregation",
    icon: FaChartLine,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  contract: {
    label: "Contract",
    icon: FaFileContract,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  tracking: { label: "Tracking", icon: FaLink, color: "text-cyan-600", bgColor: "bg-cyan-100" },
  bot: { label: "Bot Detection", icon: FaRobot, color: "text-red-600", bgColor: "bg-red-100" },
  poller: {
    label: "Pollers & Schedulers",
    icon: FaClock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  content: {
    label: "Content",
    icon: FaFileContract,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  affiliate: {
    label: "Affiliate",
    icon: FaLink,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
  legal: {
    label: "Legal Documents",
    icon: FaShieldHalved,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  other: { label: "Other", icon: FaCog, color: "text-gray-600", bgColor: "bg-gray-100" },
};

// Get category from key
const getCategoryFromKey = (key: string): string => {
  if (key.startsWith("representative_")) return "representative";
  if (key.startsWith("facebook_")) return "facebook";
  if (key.startsWith("tik_tok_")) return "tik_tok";
  if (key.startsWith("pay_os_")) return "pay_os";
  if (key.startsWith("system_")) return "system";
  if (key.startsWith("ctr_")) return "ctr";
  if (key.includes("contract")) return "contract";
  if (key.startsWith("tracking_")) return "tracking";
  if (key.startsWith("bot_")) return "bot";
  if (key.includes("poller") || key.includes("cleanup") || key.includes("check")) return "poller";
  if (key.startsWith("content_") || key.includes("censorship")) return "content";
  if (key.startsWith("affiliate_")) return "affiliate";
  if (key === "term_of_service" || key === "privacy_policy") return "legal";
  return "other";
};

// Format key to readable label
const formatKeyToLabel = (key: string): string => {
  return key
    .replace(
      /^(representative_|facebook_|tik_tok_|pay_os_|system_|ctr_|tracking_|bot_|content_|affiliate_)/,
      "",
    )
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Loading Skeleton
const ConfigSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-3">
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
              <Skeleton className="w-8 h-8 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Value renderer based on type
const renderValue = (item: any) => {
  const { value, value_type } = item;

  switch (value_type) {
    case "BOOLEAN": {
      const boolValue = value === "true" || value === true;
      return (
        <Badge
          variant={boolValue ? "default" : "secondary"}
          className={
            boolValue
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : "bg-gray-100 text-gray-600"
          }
        >
          {boolValue ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
          {boolValue ? "Enabled" : "Disabled"}
        </Badge>
      );
    }

    case "NUMBER":
      return (
        <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
          {value}
        </span>
      );

    case "ARRAY":
      return (
        <div className="max-w-md">
          <Badge variant="outline" className="text-xs">
            Array
          </Badge>
          <p
            className="text-xs text-gray-500 mt-1 truncate"
            title={typeof value === "string" ? value : JSON.stringify(value)}
          >
            {typeof value === "string"
              ? value.substring(0, 50)
              : JSON.stringify(value).substring(0, 50)}
            ...
          </p>
        </div>
      );

    case "TIPTAP_JSON":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Rich Text Content
        </Badge>
      );

    case "TEXTAREA":
      return (
        <div className="max-w-md">
          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
            Template
          </Badge>
          <p className="text-xs text-gray-500 mt-1 truncate" title={value}>
            {typeof value === "string" ? value.substring(0, 60) : ""}...
          </p>
        </div>
      );

    case "JSON":
      return (
        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
          {typeof value === "string" ? value : JSON.stringify(value)}
        </span>
      );

    case "STRING":
    default: {
      const stringValue = String(value);
      if (stringValue.length > 50) {
        return (
          <span className="text-sm text-gray-700 truncate max-w-xs block" title={stringValue}>
            {stringValue.substring(0, 50)}...
          </span>
        );
      }
      return <span className="text-sm text-gray-700">{stringValue}</span>;
    }
  }
};

interface AllConfigurationsProps {
  showHeader?: boolean;
}

const AllConfigurations = ({ showHeader = true }: AllConfigurationsProps) => {
  const dispatch = useAppDispatch();
  const { loading, allConfigs } = useConfig();

  useEffect(() => {
    if (!allConfigs) {
      dispatch(getAllConfigs());
    }
  }, [dispatch, allConfigs]);

  const handleRefresh = () => {
    dispatch(getAllConfigs());
  };

  // Group configs by category
  const groupedConfigs = (allConfigs || []).reduce(
    (acc: Record<string, ConfigItem[]>, item: ConfigItem) => {
      const category = getCategoryFromKey(item.key);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {},
  );

  // Sort categories
  const sortedCategories = Object.keys(groupedConfigs).sort((a, b) => {
    const order = [
      "system",
      "representative",
      "legal",
      "facebook",
      "tik_tok",
      "pay_os",
      "contract",
      "affiliate",
      "content",
      "poller",
      "ctr",
      "tracking",
      "bot",
      "other",
    ];
    return order.indexOf(a) - order.indexOf(b);
  });

  const renderContent = () => {
    if (!allConfigs || allConfigs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Settings className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-lg font-medium">No configurations found</p>
          <p className="text-sm">System configurations have not been set up yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {sortedCategories.map((category) => {
          const config = categoryConfig[category] || categoryConfig.other;
          const Icon = config.icon;
          const items = groupedConfigs[category];

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <h3 className="font-semibold text-gray-800">{config.label}</h3>
                <Badge variant="secondary" className="text-xs">
                  {items.length}
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-lg divide-y divide-gray-100">
                {items.map((item: ConfigItem) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700">
                        {formatKeyToLabel(item.key)}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{item.key}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {item.value_type}
                      </Badge>
                      <div className="text-right">{renderValue(item)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mt-6" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
              All Configurations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all system configuration values
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <FaRotate className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      )}

      {/* Content */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <FaCog className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-lg">System Settings</CardTitle>
              <CardDescription>
                {allConfigs?.length || 0} configuration items across all categories
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">{loading ? <ConfigSkeleton /> : renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default AllConfigurations;
