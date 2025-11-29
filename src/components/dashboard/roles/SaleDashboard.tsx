import React from "react";
import { KPIWidget, LineChartWidget } from "@/components/dashboard/chart";
import { FaBoxOpen, FaMoneyBillWave, FaBullhorn } from "react-icons/fa";

const SaleDashboard: React.FC = () => {
  // Mock data - replace with real API calls
  const totalOrdersData = { value: 1247, status: "up" as const, statusText: "+18 today" };
  const todayRevenueData = { value: 25000000, status: "up" as const, statusText: "+15%" };
  const bestSellerData = {
    value: "iPhone 15 Pro",
    status: "up" as const,
    statusText: "125 units sold",
  };

  const monthlySalesData = [
    { month: "Jan", sales: 450000 },
    { month: "Feb", sales: 520000 },
    { month: "Mar", sales: 480000 },
    { month: "Apr", sales: 610000 },
    { month: "May", sales: 580000 },
    { month: "Jun", sales: 720000 },
    { month: "Jul", sales: 690000 },
    { month: "Aug", sales: 750000 },
    { month: "Sep", sales: 680000 },
    { month: "Oct", sales: 820000 },
    { month: "Nov", sales: 780000 },
    { month: "Dec", sales: 950000 },
  ];

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Sales Staff Dashboard</h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPIWidget
          title="Total Orders"
          data={totalOrdersData}
          icon={<FaBoxOpen size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
        <KPIWidget
          title="Today Revenue"
          data={todayRevenueData}
          icon={<FaMoneyBillWave size={20} />}
          iconColor="text-green-700"
          iconBg="bg-green-100"
        />
        <KPIWidget
          title="Best Seller"
          data={bestSellerData}
          icon={<FaBullhorn size={20} />}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col gap-4">
        <LineChartWidget title="Monthly Sales" data={monthlySalesData} />
      </div>
    </div>
  );
};

export default SaleDashboard;
