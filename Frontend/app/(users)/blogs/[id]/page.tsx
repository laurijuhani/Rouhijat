"use client"; 

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BackButton from "@/components/basics/BackButton";
import { useParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Fetch from "@/utils/fetch";
import Cookies from "js-cookie";
import Tiptap from "@/components/tiptap/Tiptap";
import { useEffect, useState } from "react";
import { BlogPost } from "@/types/database_types";
import { convertContentToBase64 } from "@/utils/images";



const Page = () => {
  const { showToast } = useToast();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await Fetch.get<BlogPost>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/history-posts/${id}`,
          {
            Authorization: `Bearer ${Cookies.get('token')}`,
          }
        );
        setTitle(data.title);

        const updatedContent = await convertContentToBase64(data.content, data.images, Cookies.get('token') || '');
        setContent(updatedContent);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        showToast('error', 'Blogin lataaminen epäonnistui', 'Yritä uudelleen');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleSubmit = async (content: string, title: string) => {
    try {
      await Fetch.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/history-posts/${id}`,
        { content, title },
        {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      );
      return true;
    } catch (error) {
      showToast('error', 'Blogin päivittäminen epäonnistui', 'Yritä uudelleen');
      console.error('Error updating blog:', error);
      return false;
    }
  };
  

  return (    
    <div className="p-4">
      <BackButton />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Tiptap 
          handleSubmit={handleSubmit} 
          content={content}
          titleInput={title}
        />
      )}
    </div>
  );
};

export default function Edit() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  );
}