import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import Login from "@/pages/authentication/Login";
import Register from "@/pages/authentication/Register";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";
import { AuthenticationLayout } from "../layouts/AuthenticationLayout";
import { ForgotPassword } from "@/pages/authentication/ForgotPassword";
import { ResetPassword } from "@/pages/authentication/ResetPassword";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route
        element={
          <PrivateRoute
            allowedRoles={["Customer", "Admin", "Sale Staff", "Marketing Staff", "Content Staff"]}
          />
        }
      ></Route>

      <Route element={<AuthenticationLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/" element={<Homepage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
