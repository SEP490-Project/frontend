import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import Dashboard from "@/pages/manager/shared/Dashboard";
import { Account } from "@/pages/manager/shared";
import { User } from "@/pages/manager/admin";
import { Contract } from "@/pages/manager/brand";
import ManageLayout from "@/layouts/ManageLayout";
import Login from "@/pages/authentication/Login";
import Register from "@/pages/authentication/Register";
// import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";
import { AuthenticationRoute } from "./authentication-route";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route
        // element={
        //   <PrivateRoute
        //     allowedRoles={["Customer", "Admin", "Sale Staff", "Marketing Staff", "Content Staff"]}
        //   />
        // }
        element={<ManageLayout />}
      >
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/users" element={<User />} />
        <Route path="/brand/contracts" element={<Contract />} />
        {/* Thêm các route riêng tư khác tại đây */}
      </Route>

      <Route element={<AuthenticationRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
        <Route path="/reset-password" element={<div>Reset Password Page</div>} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/" element={<Homepage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
