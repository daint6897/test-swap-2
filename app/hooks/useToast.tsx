import React, { useState, useCallback, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";


type ToastType = "info" | "success" | "warning" | "error";


interface Toast {
  id: number;
  message: string | ReactNode;
  type: ToastType;
}


interface ToastOptions {
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}


interface ToastResult {
  showToast: (message: string | ReactNode, type?: ToastType) => number;
  showSuccessToast: (message: string | ReactNode) => number;
  showErrorToast: (message: string | ReactNode) => number;
  showWarningToast: (message: string | ReactNode) => number;
  showInfoToast: (message: string | ReactNode) => number;
  removeToast: (id: number) => void;
  clearAllToasts: () => void;
}


const getPositionClasses = (position: ToastOptions["position"]): string => {
  switch (position) {
    case "top-left":
      return "top-5 left-5";
    case "bottom-right":
      return "bottom-5 right-5";
    case "bottom-left":
      return "bottom-5 left-5";
    case "top-center":
      return "top-5 left-1/2 -translate-x-1/2";
    case "bottom-center":
      return "bottom-5 left-1/2 -translate-x-1/2";
    case "top-right":
    default:
      return "top-5 right-5";
  }
};


const getToastTypeClasses = (type: ToastType): string => {
  switch (type) {
    case "success":
      return "bg-green-500 text-white";
    case "error":
      return "bg-red-500 text-white";
    case "warning":
      return "bg-yellow-500 text-white";
    case "info":
    default:
      return "bg-blue-500 text-white";
  }
};


const useToast = (options: ToastOptions = {}): ToastResult => {
  const { duration = 3000, position = "top-right" } = options;
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let toastContainer = document.getElementById("toast-container-root");

    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container-root";
      document.body.appendChild(toastContainer);
    }

    setContainer(toastContainer);

    return () => {
      if (toastContainer && toastContainer.parentNode) {
        toastContainer.parentNode.removeChild(toastContainer);
      }
    };
  }, []);

  const showToast = useCallback(
    (message: string | ReactNode, type: ToastType = "info"): number => {
      const id = Date.now();
      const newToast: Toast = {
        id,
        message,
        type,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [duration]
  );

  const removeToast = useCallback((id: number): void => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback((): void => {
    setToasts([]);
  }, []);

  const showSuccessToast = useCallback(
    (message: string | ReactNode): number => {
      return showToast(message, "success");
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (message: string | ReactNode): number => {
      return showToast(message, "error");
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    (message: string | ReactNode): number => {
      return showToast(message, "warning");
    },
    [showToast]
  );

  const showInfoToast = useCallback(
    (message: string | ReactNode): number => {
      return showToast(message, "info");
    },
    [showToast]
  );

  const ToastContainer: React.FC = () => {
    return ReactDOM.createPortal(
      <div
        className={`fixed z-50 flex flex-col max-w-sm max-h-screen overflow-y-auto pointer-events-none ${getPositionClasses(
          position
        )}`}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${getToastTypeClasses(
              toast.type
            )} mb-3 px-4 py-3 rounded shadow-lg flex justify-between items-center min-w-[250px] pointer-events-auto animate-fade-in-down`}
          >
            <div className="mr-2">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="bg-transparent border-none text-white text-xl cursor-pointer hover:text-gray-200 focus:outline-none"
              aria-label="Close toast"
            >
              ×
            </button>
          </div>
        ))}
        <style jsx>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-down {
            animation: fadeInDown 0.3s ease-out forwards;
          }
        `}</style>
      </div>,
      container as Element
    );
  };

  useEffect(() => {
    if (container) {
      const root = createRoot(container);
      root.render(<ToastContainer />);
    }

    return () => {
      if (container) {
        const root = createRoot(container);
        root.unmount();
      }
    };
  }, [container, toasts, position]);

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    removeToast,
    clearAllToasts,
  };
};

export default useToast;
