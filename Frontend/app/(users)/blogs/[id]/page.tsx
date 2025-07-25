"use client"; 

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BackButton from "@/components/basics/BackButton";
import { ToastProvider } from "@radix-ui/react-toast";
import { useParams } from "next/navigation";


const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  

  return (    
    <ToastProvider>
      <div className="p-4">
        <BackButton />

      </div>
    </ToastProvider>
  );
};

export default function Edit() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  );
}