import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);
let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3200) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type !== "error") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

const badges = {
  success: "OK",
  error: "!",
  warning: "!",
  info: "i",
};

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      className={`toast toast--${toast.type || "info"} slide-up`}
      onClick={() => onDismiss(toast.id)}
      role="alert"
    >
      <span className="toast__badge">{badges[toast.type] || badges.info}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        className="toast__close"
        onClick={(event) => {
          event.stopPropagation();
          onDismiss(toast.id);
        }}
        aria-label="Dismiss notification"
      >
        X
      </button>
    </div>
  );
}
