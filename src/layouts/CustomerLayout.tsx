import { GlobalFooter, GlobalHeader } from "@/components/layout/customer";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <GlobalHeader />
        <main className="flex-1 bg-gray-200 px-2">
          <Outlet />
        </main>
        <GlobalFooter />
      </div>
    </div>
  );
};

export default CustomerLayout;
