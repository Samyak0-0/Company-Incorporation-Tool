import { createContext, useContext, useCallback, useState } from "react";
import { ToastContainer } from "./Notifications";

interface Toast {
  id: number;
  type: "success" | "warning" | "error";
  title: string;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (title: string, message: string) => void;
    warning: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback(
    (type: "success" | "warning" | "error", title: string, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, title, message }]);
    },
    []
  );

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title: string, msg: string) => add("success", title, msg),
    warning: (title: string, msg: string) => add("warning", title, msg),
    error: (title: string, msg: string) => add("error", title, msg),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
