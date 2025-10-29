import { Profile } from "@/components/account/Profile";
import React from "react";

const AccountPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 min-h-fit">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Account Information</h1>
      </div>
      <Profile />
    </div>
  );
};

export default AccountPage;
