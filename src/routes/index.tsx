import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage, AboutApp, AboutUs, Blog, BlogDetail, OrderTracking } from "@/pages/landing";
import NotFound from "@/pages/NotFound";
import CancelPayment from "@/pages/CancelPayment";
import SuccessPayment from "@/pages/SuccessPayment";
import { Account, Notification, Dashboard } from "@/pages/manager/shared";
import {
  Contract,
  Campaign as BrandCampaign,
  ContractPaymentBrand,
  PaymentTransaction as BrandPaymentTransaction,
  ProductApproval,
  ContentApproval as BrandContentApproval,
  ProductDetail as BrandProductDetail,
} from "@/pages/manager/brand";
import BrandContractDetail from "@/pages/manager/brand/ContractDetail";
import {
  Brand,
  Campaign as MarketingCampaign,
  CampaignDetail,
  BrandDetail,
  EditBrand,
  Contracts,
  CreateContract,
  ContractDetail,
  EditContract,
  CreateCampaign,
  EditCampaign,
  CreateBrand,
  ContentApproval,
  TaskSchedule,
  ContractPayment,
  Violation,
} from "@/pages/manager/marketing";
import ManageLayout from "@/layouts/ManageLayout";
import Login from "@/pages/authentication/Login";
import Register from "@/pages/authentication/Register";
import { AuthenticationLayout } from "../layouts/AuthenticationLayout";
import { ForgotPassword } from "@/pages/authentication/ForgotPassword";
import { ResetPassword } from "@/pages/authentication/ResetPassword";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  AssignedTasks,
  ManageContent,
  ManageTags,
  ContentDetail,
  ScheduleManagement,
} from "@/pages/manager/content";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";
import {
  Product,
  Category,
  Order,
  Review,
  Transaction,
  BasicInfoStep,
  VariantsStep,
  DoneStep,
  PreOrder,
  AssignedTask,
  EditProduct,
  ProductDetail,
} from "@/pages/manager/sale";
import ContentPreviewPage from "@/pages/manager/marketing/content-approval/ContentPreviewPage";
import AddProductStep from "@/components/manage/sale/product/AddProductStep";
import { Channel, User, VariantAttribute, ProductOptions } from "@/pages/manager/admin";
import { CreateConceptStep } from "@/pages/manager/sale/product/add-product-step/CreateConceptStep";
import SalesPwaLayout from "@/layouts/SalesPWALayout";
import SalesPwaRoute from "./sales-pwa-route";
import {
  SalesPwaLogin,
  SalesOrderDetailPage,
  SalesOrderListPage,
  SalesPreOrderPage,
  SalesProfilePage,
} from "@/pages/pwa";
import { PrivacyPolicy } from "@/pages/landing/PrivacyPolicy";
import { TermsOfUses } from "@/pages/landing/TermsOfUses";
import AllConfigurations from "@/pages/manager/admin/configurations/AllConfigurations";
import TermsOfService from "@/pages/manager/admin/configurations/TermsOfService";
import Representative from "@/pages/manager/admin/configurations/Representative";
import PrivacyPolicyAdmin from "@/pages/manager/admin/configurations/PrivacyPolicyAdmin";
import GhnMock from "@/pages/manager/shared/GhnMock";
import SystemSpecs from "@/pages/manager/admin/SystemSpecs";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/sales-app/login" element={<SalesPwaLogin />} />
      <Route element={<SalesPwaRoute />}>
        <Route path="/sales-app" element={<SalesPwaLayout />}>
          <Route index element={<SalesOrderListPage />} />
          <Route path="orders" element={<SalesOrderListPage />} />
          <Route path="orders/:id" element={<SalesOrderDetailPage />} />
          <Route path="pre-orders" element={<SalesPreOrderPage />} />
          <Route path="pre-orders/:id" element={<SalesOrderDetailPage />} />
          <Route path="profile" element={<SalesProfilePage />} />
        </Route>
      </Route>

      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/about-app" element={<AboutApp />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/terms-of-uses" element={<TermsOfUses />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
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
          <Route path="ghn-mock" element={<GhnMock />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/manage/admin" element={<ManageLayout />}>
          <Route path="users" element={<User />} />
          <Route path="variant-attribute" element={<VariantAttribute />} />
          <Route path="product-options" element={<ProductOptions />} />
          <Route path="channel" element={<Channel />} />
          <Route path="configurations">
            <Route index element={<AllConfigurations />} />
            <Route path="representative" element={<Representative />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="privacy-policy" element={<PrivacyPolicyAdmin />} />
          </Route>
          <Route path="system-specs" element={<SystemSpecs />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["SALES_STAFF"]} />}>
        <Route path="/manage/sale" element={<ManageLayout />}>
          <Route path="task" element={<AssignedTask />} />
          <Route path="product">
            <Route index element={<Product type="STANDARD" />} />
            <Route path="limited" element={<Product type="LIMITED" />} />
          </Route>
          <Route path="product/create" element={<AddProductStep />}>
            <Route index element={<BasicInfoStep />} />
            <Route path="concept" element={<CreateConceptStep />} />
            <Route path="variants" element={<VariantsStep />} />
            <Route path="done" element={<DoneStep />} />
          </Route>
          <Route path="product/limited/create" element={<AddProductStep />}>
            <Route index element={<BasicInfoStep />} />
            <Route path="concept" element={<CreateConceptStep />} />
            <Route path="variants" element={<VariantsStep />} />
            <Route path="done" element={<DoneStep />} />
          </Route>
          <Route path="product/:id/edit" element={<EditProduct />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="category" element={<Category />} />
          <Route path="order">
            <Route index element={<Order />} />
            <Route path="pre-order" element={<PreOrder />} />
          </Route>

          <Route path="review" element={<Review />} />
          <Route path="transaction">
            <Route index element={<Transaction type="ORDER" />} />
            <Route path="pre-order" element={<Transaction type="PREORDER" />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["MARKETING_STAFF"]} />}>
        <Route path="/manage/marketing" element={<ManageLayout />}>
          <Route path="brands" element={<Brand />} />
          <Route path="brands/create" element={<CreateBrand />} />
          <Route path="brands/:id" element={<BrandDetail />} />
          <Route path="brands/:id/edit" element={<EditBrand />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/create" element={<CreateContract />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="contracts/edit/:id" element={<EditContract />} />
          <Route path="campaigns" element={<MarketingCampaign />} />
          <Route path="campaigns/create" element={<CreateCampaign />} />
          <Route path="campaigns/edit/:id" element={<EditCampaign />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="contents-approval" element={<ContentApproval />} />
          <Route path="contents-approval/preview/:id" element={<ContentPreviewPage />} />
          <Route path="task-schedule" element={<TaskSchedule />} />
          <Route path="contract-payment" element={<ContractPayment />} />
          <Route path="violations" element={<Violation />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["BRAND_PARTNER"]} />}>
        <Route path="/manage/brand" element={<ManageLayout />}>
          <Route path="contracts" element={<Contract />} />
          <Route path="contracts/:id" element={<BrandContractDetail />} />
          <Route path="campaigns" element={<BrandCampaign />} />
          <Route path="campaigns/:id" element={<CampaignDetail userRole="brand" />} />
          <Route path="contract-payment" element={<ContractPaymentBrand />} />
          <Route path="payment-transaction" element={<BrandPaymentTransaction />} />
          <Route path="product-approval" element={<ProductApproval />} />
          <Route path="product-approval/:id" element={<BrandProductDetail />} />
          <Route path="content-approval" element={<BrandContentApproval />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["CONTENT_STAFF"]} />}>
        <Route path="/manage/content" element={<ManageLayout />}>
          <Route path="task" element={<AssignedTasks />} />
          <Route path="all-contents" element={<ManageContent />} />
          <Route path="all-contents/:id" element={<ContentDetail />} />
          <Route path="tag" element={<ManageTags />} />
          <Route path="schedules" element={<ScheduleManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/payment-cancel" element={<CancelPayment />} />
      <Route path="/payment-success" element={<SuccessPayment />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
