import { useState, useEffect, useCallback } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import "./Notifications.css";

const ICONS = {
  success: <FaCircleCheck />,
  warning: <MdError />,
  error: <IoIosWarning />,
};

const DURATION = 4000;

const Toast = ({ id, type, title, message, onRemove }) => {
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
      <div className="toast-body">
        {ICONS[type]}
        <div className="toast-text">
          <div className="toast-title">{title}</div>
          <div className="toast-message">{message}</div>
        </div>
      </div>
      <div
        className="toast-progress"
        style={{ animationDuration: `${DURATION}ms` }}
      />
      <button className="toast-close" onClick={dismiss}>
        ✕
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => (
  <div className="toast-container">
    {toasts.map((t) => (
      <Toast key={t.id} {...t} onRemove={onRemove} />
    ))}
  </div>
);

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title, msg) => add("success", title, msg),
    warning: (title, msg) => add("warning", title, msg),
    error: (title, msg) => add("error", title, msg),
    // info: (title, msg) => add("info", title, msg),
  };

  const Container = useCallback(
    () => <ToastContainer toasts={toasts} onRemove={remove} />,
    [toasts, remove],
  );

  return { toast, ToastContainer: Container };
};
