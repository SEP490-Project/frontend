import { useAuth } from "@/libs/hooks/useAuth";
import {
  AdminDashboard,
  BrandDashboard,
  ContentDashboard,
  MarketingDashboard,
  SaleDashboard,
} from "@/components/dashboard/roles";

const DashboardPage: React.FC = () => {
  const { role } = useAuth();

  // Render dashboard component based on user role
  const renderDashboard = () => {
    switch (role) {
      case "ADMIN":
        return <AdminDashboard />;
      case "BRAND_PARTNER":
        return <BrandDashboard />;
      case "CONTENT_STAFF":
        return <ContentDashboard />;
      case "MARKETING_STAFF":
        return <MarketingDashboard />;
      case "SALES_STAFF":
        return <SaleDashboard />;
      default:
        return (
          <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
            <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
            <div className="text-center text-gray-500">
              <p>No dashboard available for your role: {role}</p>
              <p>Please contact your administrator for access.</p>
            </div>
          </div>
        );
    }
  };

  return renderDashboard();
};

export default DashboardPage;
