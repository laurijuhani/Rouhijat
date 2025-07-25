"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ListBlogs from "@/components/blogs/ListBlogs";
import UserNavBar from "@/components/dashboard/UserNavBar";
import Tiptap from "@/components/tiptap/Tiptap";
import { ToastProvider } from "@/context/ToastContext";
import { User } from "@/hooks/useSession";
import Fetch from "@/utils/fetch";
import { useToast } from "@/context/ToastContext";
import Cookies from "js-cookie";

const Page = ({ user }: { user: User }) => {
  const { showToast } = useToast();

  const handleSubmit = async (content: string, title: string) => {
    try {
      const response = await Fetch.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/history-posts`,
        { content, title },
        {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      ); 

      const data = await response.json;
      console.log(data);
      
      //TODO: store the data in the blogs list
      
      showToast('success', 'Postaus lisätty onnistuneesti', '');
      return true;
    } catch (error) {
      showToast('error', 'Postauksen lähetys epäonnistui', 'Yritä uudelleen');
      console.error('Error submitting content:', error);
      return false;
    }
  };

  return (
    <div>
      <ToastProvider>
        <UserNavBar user={user} />
        <Tiptap handleSubmit={handleSubmit} />
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
