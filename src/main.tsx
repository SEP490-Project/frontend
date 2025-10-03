import React from "react";
import { createRoot } from "react-dom/client";
import ReduxProvider from "./provider";
import AppRoutes from "./routes";
import "./index.css";
import "./styles/font.css";
import { TooltipProvider } from "./components/ui/tooltip";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ReduxProvider>
      <TooltipProvider delayDuration={200}>
        <AppRoutes />
      </TooltipProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
