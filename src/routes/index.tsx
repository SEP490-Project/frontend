
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Private routes: chỉ cho phép các role đã đăng nhập */}
      <Route element={<PrivateRoute allowedRoles={["Customer", "Admin", "Sale Staff", "Marketing Staff", "Content Staff"]} />}> 
        <Route path="/" element={<Homepage />} />
        {/* Thêm các route riêng tư khác tại đây */}
      </Route>

      {/* Public routes: chỉ cho phép người chưa đăng nhập */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
