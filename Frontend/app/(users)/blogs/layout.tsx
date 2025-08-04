"use client"; 
import { ToastProvider } from "@/context/ToastContext";


export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastProvider>
        {children}
      </ToastProvider>
    </div>
  );
}
