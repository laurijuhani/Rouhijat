import React, { createContext, useContext, useState, ReactNode } from "react";
import CustomToast from "@/components/dashboard/Toast";

interface ToastContextProps {
  showToast: (status: "success" | "error", title: string, description: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastStatus, setToastStatus] = useState<"success" | "error">("success");
  const [toastTitle, setToastTitle] = useState("");
  const [toastDescription, setToastDescription] = useState("");

  const showToast = (status: "success" | "error", title: string, description: string) => {
    setToastStatus(status);
    setToastTitle(title);
    setToastDescription(description);
    setToastOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CustomToast
        status={toastStatus}
        title={toastTitle}
        description={toastDescription}
        open={toastOpen}
        onOpenChange={setToastOpen}
      />
    </ToastContext.Provider>
  );
};