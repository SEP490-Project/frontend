import React from "react";
import { KPIWidget, TableWidget } from "@/components/dashboard/chart";
import { MdCampaign, MdPendingActions } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";

const BrandDashboard: React.FC = () => {
  // Mock data - replace with real API calls
  const campaignsData = { value: 12, status: "up" as const, statusText: "+3 this month" };
  const pendingPaymentsData = { value: 45000000, statusText: "2 invoices" };
  const lastInvoiceData = { value: "INV-2024-001", statusText: "Paid on Nov 15" };

  const kpisData = [
    { metric: "Total Reach", value: "2.5M", change: "+12%" },
    { metric: "Engagement Rate", value: "3.8%", change: "+0.5%" },
    { metric: "Conversion Rate", value: "2.1%", change: "-0.2%" },
    { metric: "Revenue Generated", value: "$125,000", change: "+8%" },
  ];

  return (
    <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Brand Partner Dashboard</h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPIWidget
          title="Number of Campaigns"
          data={campaignsData}
          icon={<MdCampaign size={20} />}
          iconColor="text-sky-600"
          iconBg="bg-sky-100"
        />
        <KPIWidget
          title="Pending Payments"
          data={pendingPaymentsData}
          icon={<MdPendingActions size={20} />}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
        />
        <KPIWidget
          title="Last Invoice"
          data={lastInvoiceData}
          icon={<FaFileInvoiceDollar size={20} />}
          iconColor="text-violet-600"
          iconBg="bg-violet-100"
        />
      </div>

      {/* Table Section */}
      <div className="grid grid-cols-1 gap-4">
        <TableWidget title="KPIs Overview" data={kpisData} />
      </div>
    </div>
  );
};

export default BrandDashboard;
