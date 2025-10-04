import { useEffect, useState } from "react";
import { dashboardConfig } from "@/libs/dashboardConfig";
import WidgetFactory from "@/components/dashboard/WidgetFactory";
import dashboardData from "./dashboardData.json";
import { useAuth } from "@/libs/hooks/useAuth";

// Kiểu widget
export type WidgetType = "KPI" | "BarChart" | "LineChart" | "PieChart" | "Table";

export interface WidgetConfig {
  type: WidgetType;
  title: string;
  key: string;
}

// Role phải khớp với dashboardConfig
type Role = keyof typeof dashboardConfig;

// Kiểu dữ liệu dashboardData (theo JSON import vào)
type DashboardData = typeof dashboardData;

const DashboardPage: React.FC = () => {
  const { role } = useAuth();

  // Chỉ nhận role hợp lệ (có trong dashboardConfig)
  const roleKey = (role && role in dashboardConfig ? role : null) as Role | null;

  // Widgets của role hiện tại
  const widgets: WidgetConfig[] = roleKey ? dashboardConfig[roleKey] : [];

  // Data của role hiện tại
  const [data, setData] = useState<DashboardData[Role] | null>(null);

  useEffect(() => {
    if (roleKey) {
      setData(dashboardData[roleKey] || null);
    } else {
      setData(null);
    }
  }, [roleKey]);

  // Phân loại widget
  const kpiWidgets = widgets.filter((w) => w.type === "KPI");
  const chartWidgets = widgets.filter((w) =>
    ["BarChart", "LineChart", "PieChart"].includes(w.type),
  );
  const tableWidgets = widgets.filter((w) => w.type === "Table");

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>

      {/* KPI Section */}
      {kpiWidgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiWidgets.map((w, i) => (
            <WidgetFactory
              key={i}
              config={w}
              data={data ? data[w.key as keyof typeof data] : null}
            />
          ))}
        </div>
      )}

      {/* Chart Section */}
      {chartWidgets.length > 0 && (
        <div className="flex flex-col gap-4">
          {chartWidgets.map((w, i) => (
            <div key={i} className="w-full">
              <WidgetFactory config={w} data={data ? data[w.key as keyof typeof data] : null} />
            </div>
          ))}
        </div>
      )}

      {/* Table Section */}
      {tableWidgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tableWidgets.map((w, i) => (
            <WidgetFactory
              key={i}
              config={w}
              data={data ? data[w.key as keyof typeof data] : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
