import { useState, useEffect, useCallback } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import "./Notifications.css";
import type { Toast } from "../../utils/ToastProvider.tsx";

interface IndividualToast extends Toast {
  onRemove: (id: number) => void;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

const ICONS = {
  success: <FaCircleCheck />,
  warning: <MdError />,
  error: <IoIosWarning />,
};

const DURATION = 4000;

const Toast = ({ id, type, title, message, onRemove }: IndividualToast) => {
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
    <div className={`toast ${type}${exiting ? " exiting" : ""}`}>
      <div className={"toast-body"}>
        {ICONS[type]}
        <div className={"toast-text"}>
          <div className={"toast-title"}>{title}</div>
          <div className={"toast-message"}>{message}</div>
        </div>
      </div>
      <div
        className={"toast-progress"}
        style={{ animationDuration: `${DURATION}ms` }}
      />
      <button className={"toast-close"} onClick={dismiss}>
        ✕
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => (
  <div className={"toast-container"}>
    {toasts.map((t) => (
      <Toast key={t.id} {...t} onRemove={onRemove} />
    ))}
  </div>
);
