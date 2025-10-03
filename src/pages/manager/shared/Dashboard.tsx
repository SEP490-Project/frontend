import { useEffect, useState } from "react";
import { dashboardConfig } from "@/libs/dashboardConfig";
import WidgetFactory from "@/components/dashboard/WidgetFactory";
import dashboardData from "./dashboardData.json";

const DashboardPage: React.FC = () => {
  // TODO: lấy role từ context hoặc props
  const role = "sales"; // giả lập role, chọn một role hợp lệ từ dashboardConfig
  const widgets = dashboardConfig[role] || [];

  const [data, setData] = useState<any>({});

  useEffect(() => {
    setData(dashboardData[role] || {});
  }, [role]);

  // Phân loại widget
  const kpiWidgets = widgets.filter((w) => w.type === "KPI");
  const chartWidgets = widgets.filter((w) =>
    ["BarChart", "LineChart", "PieChart"].includes(w.type),
  );
  const tableWidgets = widgets.filter((w) => w.type === "Table");

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
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
    </div>
  );
};

export default DashboardPage;
