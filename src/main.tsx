import React from "react";
import { createRoot } from "react-dom/client";
import ReduxProvider from "./provider";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./styles/font.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { ToastContainer } from "react-toastify";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ReduxProvider>
      <TooltipProvider delayDuration={200}>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </TooltipProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
