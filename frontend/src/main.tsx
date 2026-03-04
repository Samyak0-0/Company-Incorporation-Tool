import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./utils/ContextProvider";
import { ToastProvider } from "./utils/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ContextProvider>
  </StrictMode>,
);
