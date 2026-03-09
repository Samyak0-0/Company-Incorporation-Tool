import { useState, useEffect, useCallback } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import styles from "./Notifications.module.css";
import type { Toast, ToastType } from "./ToastProvider";

interface ToastProps extends Toast {
  onRemove: (id: number) => void;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

interface ToastContext {
  success: (title: string, message: string) => void;
  warning: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
}

const ICONS = {
  success: <FaCircleCheck />,
  warning: <MdError />,
  error: <IoIosWarning />,
};

const DURATION = 4000;

const Toast = ({ id, type, title, message, onRemove }: ToastProps) => {
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  useEffect(() => {
    const t = setTimeout(dismiss, DURATION);
    return () => clearTimeout(t);
  }, [dismiss]);

  return (
    <div className={`${styles.toast} ${type}${exiting ? " exiting" : ""}`}>
      <div className={styles["toast-body"]}>
        {ICONS[type]}
        <div className={styles["toast-text"]}>
          <div className={styles["toast-title"]}>{title}</div>
          <div className={styles["toast-message"]}>{message}</div>
        </div>
      </div>
      <div
        className={styles["toast-progress"]}
        style={{ animationDuration: `${DURATION}ms` }}
      />
      <button className={styles["toast-close"]} onClick={dismiss}>
        ✕
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => (
  <div className={styles["toast-container"]}>
    {toasts.map((t) => (
      <Toast key={t.id} {...t} onRemove={onRemove} />
    ))}
  </div>
);

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, title: string, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast: ToastContext = {
    success: (title, msg) => add("success", title, msg),
    warning: (title, msg) => add("warning", title, msg),
    error: (title, msg) => add("error", title, msg),
  };

  const Container = useCallback(
    () => <ToastContainer toasts={toasts} onRemove={remove} />,
    [toasts, remove],
  );

  return { toast, ToastContainer: Container };
};
