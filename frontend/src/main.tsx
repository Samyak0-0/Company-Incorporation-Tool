import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./utils/ContextProvider";
import { ToastProvider } from "./utils/ToastProvider";
import { AuthContextProvider } from "./utils/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextProvider>
      <AuthContextProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthContextProvider>
    </ContextProvider>
  </StrictMode>,
);
