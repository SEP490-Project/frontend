import React from "react";
import { KPIWidget, LineChartWidget, TableWidget } from "@/components/dashboard/chart";
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
    { month: "Jan", value: 450000 },
    { month: "Feb", value: 520000 },
    { month: "Mar", value: 480000 },
    { month: "Apr", value: 610000 },
    { month: "May", value: 580000 },
    { month: "Jun", value: 720000 },
    { month: "Jul", value: 690000 },
    { month: "Aug", value: 750000 },
    { month: "Sep", value: 680000 },
    { month: "Oct", value: 820000 },
    { month: "Nov", value: 780000 },
    { month: "Dec", value: 1000000 },
  ];

  const topSellingProductsData = [
    { name: "iPhone 15 Pro", unitsSold: 125, revenue: 12500000 },
    { name: "Samsung Galaxy S23", unitsSold: 98, revenue: 9800000 },
    { name: "Google Pixel 7", unitsSold: 76, revenue: 7600000 },
  ];

  const recentOrdersData = [
    { orderId: "ORD12345", customer: "John Doe", total: 1500, status: "Delivered" },
    { orderId: "ORD12346", customer: "Jane Smith", total: 2500, status: "Shipped" },
    { orderId: "ORD12347", customer: "Alice Johnson", total: 3200, status: "Processing" },
  ];

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Sales Staff Dashboard</h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Daily Sales"
          data={totalOrdersData}
          icon={<FaBoxOpen size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
        <KPIWidget
          title="Monthly Revenue"
          data={todayRevenueData}
          icon={<FaMoneyBillWave size={20} />}
          iconColor="text-green-700"
          iconBg="bg-green-100"
        />
        <KPIWidget
          title="Total Orders"
          data={totalOrdersData}
          icon={<FaBoxOpen size={20} />}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
        <KPIWidget
          title="Total Products Sold"
          data={bestSellerData}
          icon={<FaBullhorn size={20} />}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col gap-4">
        <LineChartWidget title="Total Revenue" data={monthlySalesData} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TableWidget title="Top Selling Products" data={topSellingProductsData} />
        <TableWidget title="Recent Orders" data={recentOrdersData} />
      </div>
    </div>
  );
};

export default SaleDashboard;
