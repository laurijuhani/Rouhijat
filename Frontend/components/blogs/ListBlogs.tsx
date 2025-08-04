import Cookies from "js-cookie";
import { BlogPost } from "@/types/database_types";
import { Dispatch, useEffect, SetStateAction, useState } from "react";
import { useToast } from "@/context/ToastContext";
import {
  SortableList,
  SortableListItem,
} from "@/components/ui/sortable-list";
import Fetch from "@/utils/fetch";
import { Button } from "../ui/button";
import Spinner from "../basics/Spinner";

interface ListBlogsProps {
  blogs: BlogPost[];
  setBlogs: Dispatch<SetStateAction<BlogPost[]>>;
}


const ListBlogs = ({ blogs, setBlogs }: ListBlogsProps) => {
  const { showToast } = useToast();
  const [savingOrder, setSavingOrder] = useState(false);
  
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const orderData = blogs.map((blog, index) => ({
        id: blog.id,
        order: index + 1,
      }));

      await Fetch.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/history-posts/reorder`,
        orderData,
        {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      ); 

      showToast('success', 'Järjestys tallennettu onnistuneesti', '');
    } catch (error) {
      console.error("Failed to save order:", error);
      showToast('error', 'Järjestyksen tallennus epäonnistui', 'Yritä uudelleen');
    } finally {
      setSavingOrder(false);
    }
  };


  return (
    <div className="pt-4">
      <SortableList 
        blogs={blogs}
        handleDelete={handleDelete}
        setItems={setBlogs}
        renderItem={
          (blog: BlogPost, index: number, onRemoveItem: (id: number) => void) => (
            <SortableListItem
              key={blog.id}
              blog={blog}
              order={index}
              onRemoveItem={onRemoveItem}
              handleDrag={() => {}}
            />
          )
        }
      /> 

      <div className="flex justify-center mt-4">
        <Button
          onClick={handleSaveOrder}
          disabled={savingOrder}
          className="text-text-primary w-32"
        >
          {savingOrder ? <Spinner /> : 'Tallenna järjestys'}
        </Button>
      </div>
    </div>
  );
};

export default ListBlogs;