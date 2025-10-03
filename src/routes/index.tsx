import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import NotFound from "@/pages/NotFound";
import { Account, Notification, Dashboard } from "@/pages/manager/shared";
import { User } from "@/pages/manager/admin";
import { Contract, Campaign } from "@/pages/manager/brand";
import {
  Partner,
  Assignment,
  Contracts,
  AddContract,
  ContractDetail,
  AddCampaign,
} from "@/pages/manager/marketing";
import ManageLayout from "@/layouts/ManageLayout";
import Login from "@/pages/authentication/Login";
import Register from "@/pages/authentication/Register";
// import PrivateRoute from "./private-route";
import { AuthenticationLayout } from "../layouts/AuthenticationLayout";
import { ForgotPassword } from "@/pages/authentication/ForgotPassword";
import { ResetPassword } from "@/pages/authentication/ResetPassword";
import CustomerLayout from "@/layouts/CustomerLayout";
import { AssignedTasks, ManageContent, ManageTags } from "@/pages/manager/content";
import { Product, ProductDetail } from "@/pages/manager/sale";

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
        <Route path="notification" element={<Notification />} />
        <Route path="admin/users" element={<User />} />
        <Route path="brand/contracts" element={<Contract />} />
        <Route path="brand/campaigns" element={<Campaign />} />

        <Route path="marketing/partners" element={<Partner />} />
        <Route path="marketing/contracts" element={<Contracts />} />
        <Route path="marketing/assignments" element={<Assignment />} />
        <Route path="marketing/contracts/add" element={<AddContract />} />
        <Route path="marketing/contracts/:id" element={<ContractDetail />} />

        <Route path="marketing/campaigns/add" element={<AddCampaign />} />

        <Route path="sale/product" element={<Product />} />
        <Route path="sale/product/create" element={<ProductDetail />} />
        <Route path="sale/product/:id/edit" element={<ProductDetail />} />
        <Route path="sale/product/:id" element={<ProductDetail />} />

        <Route path="content/task" element={<AssignedTasks />} />
        <Route path="content/blog" element={<ManageContent />} />
        <Route path="content/tag" element={<ManageTags />} />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
