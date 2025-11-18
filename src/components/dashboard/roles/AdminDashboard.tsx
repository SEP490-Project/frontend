import React from "react";
import { KPIWidget, LineChartWidget, TableWidget } from "@/components/dashboard/chart";
import { FaUser, FaMoneyBillWave } from "react-icons/fa";

const AdminDashboard: React.FC = () => {
  // Mock data - replace with real API calls
  const totalUsers = { value: 1200, status: "up" as const, statusText: "+5%" };
  const totalRevenue = { value: 500000000, status: "down" as const, statusText: "-2%" };

  const monthlyRevenueData = [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 200 },
    { month: "Mar", value: 150 },
    { month: "Apr", value: 300 },
    { month: "May", value: 250 },
    { month: "Jun", value: 400 },
    { month: "Jul", value: 350 },
    { month: "Aug", value: 450 },
    { month: "Sep", value: 500 },
    { month: "Oct", value: 600 },
    { month: "Nov", value: 550 },
    { month: "Dec", value: 700 },
  ];

  const topChannelsData = [
    { channel: "Facebook", ctr: 3.5, reach: 20000 },
    { channel: "Instagram", ctr: 2.8, reach: 15000 },
    { channel: "TikTok", ctr: 4.2, reach: 25000 },
    { channel: "YouTube", ctr: 3.1, reach: 18000 },
  ];

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Admin Dashboard</h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="Total Users"
          data={totalUsers}
          icon={<FaUser size={20} />}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <KPIWidget
          title="Total Revenue"
          data={totalRevenue}
          icon={<FaMoneyBillWave size={20} />}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col gap-4">
        <LineChartWidget title="Monthly Revenue" data={monthlyRevenueData} />
      </div>

      {/* Table Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TableWidget title="Top Channels" data={topChannelsData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
