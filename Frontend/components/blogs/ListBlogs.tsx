import Cookies from "js-cookie";
import { BlogPost } from "@/types/database_types";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import Blog from "./Blog";

const ListBlogs = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/history-posts`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();        
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Oletko varma, että haluat poistaa tämän blogipostauksen?")) return; 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/history-posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
      setBlogs(blogs.filter(blog => blog.id !== id));
      showToast('success', 'Postaus poistettu onnistuneesti', '');
    } catch (error) {
      console.error("Failed to delete blog:", error);
      showToast('error', 'Postauksen poisto epäonnistui', 'Yritä uudelleen');
    }
  };


  return (
    <div className="pt-4">
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} handleDelete={handleDelete} />
      ))}
    </div>
  );
};

export default ListBlogs;