import { useEffect, useState } from "react";
import { dashboardConfig } from "@/libs/dashboardConfig";
import WidgetFactory from "@/components/dashboard/WidgetFactory";
import dashboardData from "./dashboardData.json";

export default function Dashboard() {
  // TODO: lấy role từ context hoặc props
  const role = "brand"; // giả lập role, chọn một role hợp lệ từ dashboardConfig
  const widgets = dashboardConfig[role] || [];

  // loading state
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    // giả lập fetch API, có thể thay bằng real API
    const timer = setTimeout(() => {
      setData(dashboardData[role] || {});
      setLoading(false);
    }, 500); // 500ms loading
    return () => clearTimeout(timer);
  }, [role]);

  // Phân loại widget
  const kpiWidgets = widgets.filter((w) => w.type === "KPI");
  const chartWidgets = widgets.filter((w) =>
    ["BarChart", "LineChart", "PieChart"].includes(w.type),
  );
  const tableWidgets = widgets.filter((w) => w.type === "Table");

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiWidgets.map((w, i) => (
              <WidgetFactory key={i} config={w} data={data[w.key]} />
            ))}
          </div>

          {/* Chart Section */}
          {chartWidgets.length > 0 && (
            <div className="flex flex-col gap-4">
              {chartWidgets.map((w, i) => (
                <div key={i} className="w-full">
                  <WidgetFactory config={w} data={data[w.key]} />
                </div>
              ))}
            </div>
          )}

          {/* Table Section */}
          {tableWidgets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tableWidgets.map((w, i) => (
                <WidgetFactory key={i} config={w} data={data[w.key]} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
