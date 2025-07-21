"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ListBlogs from "@/components/blogs/ListBlogs";
import UserNavBar from "@/components/dashboard/UserNavBar";
import Tiptap from "@/components/tiptap/Tiptap";
import { ToastProvider } from "@/context/ToastContext";
import { User } from "@/hooks/useSession";

const Page = ({ user }: { user: User }) => {
  return (
    <div>
      <ToastProvider>
        <UserNavBar user={user} />
        <Tiptap />
        <ListBlogs />
      </ToastProvider>
    </div>
  );
};

export default function Profile() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  );
}
