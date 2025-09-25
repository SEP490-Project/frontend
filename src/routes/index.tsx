import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import Dashboard from "@/pages/manager/shared/Dashboard";
import { Account } from "@/pages/manager/shared";
import { User } from "@/pages/manager/admin";
import { Contract, Campaign } from "@/pages/manager/brand";
import { Partner, Assignment, Contracts } from "@/pages/manager/marketing";
import ManageLayout from "@/layouts/ManageLayout";
import Login from "@/pages/authentication/Login";
import Register from "@/pages/authentication/Register";
// import PrivateRoute from "./private-route";
import { AuthenticationLayout } from "../layouts/AuthenticationLayout";
import { ForgotPassword } from "@/pages/authentication/ForgotPassword";
import { ResetPassword } from "@/pages/authentication/ResetPassword";
import CustomerLayout from "@/layouts/CustomerLayout";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route
        // element={
        //   <PrivateRoute
        //     allowedRoles={["Customer", "Admin", "Sale Staff", "Marketing Staff", "Content Staff"]}
        //   />
        // }
        path="/manage"
        element={<ManageLayout />}
      >
        <Route path="" element={<Dashboard />} />
        <Route path="account" element={<Account />} />
        <Route path="admin/users" element={<User />} />
        <Route path="brand/contracts" element={<Contract />} />
        <Route path="brand/campaigns" element={<Campaign />} />

        <Route path="marketing/partners" element={<Partner />} />
        <Route path="marketing/contracts" element={<Contracts />} />
        <Route path="marketing/assignments" element={<Assignment />} />
        {/* Thêm các route riêng tư khác tại đây */}
      </Route>

      <Route
        // element={
        //   <PrivateRoute
        //     allowedRoles={["Customer", "Admin", "Sale Staff", "Marketing Staff", "Content Staff"]}
        //   />
        // }
        element={<CustomerLayout />}
      >
        <Route path="/" element={<Homepage />} />
      </Route>

      <Route element={<AuthenticationLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
