import React from "react";
import { createRoot } from "react-dom/client";
import ReduxProvider from "./provider";
import AppRoutes from "./routes";
import "./index.css";
import "./styles/font.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import { LoadingProvider } from "./libs/hooks/useLoading";
import { NotificationProvider } from "@/libs/contexts/NotificationContext";
import { useAuth } from "./libs/hooks/useAuth";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

const RootApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <LoadingProvider>
      <NotificationProvider isAuthenticated={isAuthenticated}>
        <TooltipProvider delayDuration={200}>
          <AppRoutes />
        </TooltipProvider>
        <Toaster position="top-right" richColors />
      </NotificationProvider>
    </LoadingProvider>
  );
};

root.render(
  <React.StrictMode>
    <ReduxProvider>
      <RootApp />
    </ReduxProvider>
  </React.StrictMode>,
);
