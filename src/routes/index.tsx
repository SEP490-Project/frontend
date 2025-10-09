import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import NotFound from "@/pages/NotFound";
import { Account, Notification, Dashboard } from "@/pages/manager/shared";
import { User } from "@/pages/manager/admin";
import { Contract, Campaign } from "@/pages/manager/brand";
import {
  Brand,
  Assignment,
  Contracts,
  AddContract,
  ContractDetail,
  AddCampaign,
  AddBrand,
} from "@/pages/manager/marketing";
import ManageLayout from "@/layouts/ManageLayout";
import Login from "@/pages/authentication/Login";
import Register from "@/pages/authentication/Register";
import { AuthenticationLayout } from "../layouts/AuthenticationLayout";
import { ForgotPassword } from "@/pages/authentication/ForgotPassword";
import { ResetPassword } from "@/pages/authentication/ResetPassword";
import CustomerLayout from "@/layouts/CustomerLayout";
import { AssignedTasks, ManageContent, ManageTags } from "@/pages/manager/content";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";
import {
  Product,
  ProductDetail,
  Category,
  Order,
  OrderDetail,
  Review,
  Transaction,
} from "@/pages/manager/sale";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Homepage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<AuthenticationLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      <Route
        element={
          <PrivateRoute
            allowedRoles={[
              "ADMIN",
              "SALES_STAFF",
              "MARKETING_STAFF",
              "CONTENT_STAFF",
              "BRAND_PARTNER",
            ]}
          />
        }
      >
        <Route path="/manage" element={<ManageLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="account" element={<Account />} />
          <Route path="notification" element={<Notification />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/manage/admin" element={<ManageLayout />}>
          <Route path="users" element={<User />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["SALES_STAFF"]} />}>
        <Route path="/manage/sale" element={<ManageLayout />}>
          <Route path="product" element={<Product />} />
          <Route path="product/create" element={<ProductDetail />} />
          <Route path="product/:id/edit" element={<ProductDetail />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="category" element={<Category />} />
          <Route path="order" element={<Order />} />
          <Route path="order/:id" element={<OrderDetail />} />
          <Route path="review" element={<Review />} />
          <Route path="transaction" element={<Transaction />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["MARKETING_STAFF"]} />}>
        <Route path="/manage/marketing" element={<ManageLayout />}>
          <Route path="brands" element={<Brand />} />
          <Route path="brands/add" element={<AddBrand />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/add" element={<AddContract />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="assignments" element={<Assignment />} />
          <Route path="campaigns/add" element={<AddCampaign />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["BRAND_PARTNER"]} />}>
        <Route path="/manage/brand" element={<ManageLayout />}>
          <Route path="contracts" element={<Contract />} />
          <Route path="campaigns" element={<Campaign />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["CONTENT_STAFF"]} />}>
        <Route path="/manage/content" element={<ManageLayout />}>
          <Route path="task" element={<AssignedTasks />} />
          <Route path="blog" element={<ManageContent />} />
          <Route path="tag" element={<ManageTags />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
