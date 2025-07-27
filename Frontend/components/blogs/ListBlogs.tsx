import Cookies from "js-cookie";
import { BlogPost } from "@/types/database_types";
import { Dispatch, useEffect, SetStateAction, useState } from "react";
import { useToast } from "@/context/ToastContext";
import Blog from "./Blog";

interface ListBlogsProps {
  blogs: BlogPost[];
  setBlogs: Dispatch<SetStateAction<BlogPost[]>>;
}

/**
 * TODO:
 * - Implement drag and drop functionality for reordering blogs.
 * - Implement touch support for mobile devices.
 * - Add submit button for reordering the posts
 */

const ListBlogs = ({ blogs, setBlogs }: ListBlogsProps) => {
  const { showToast } = useToast();
  const [draggingBlog, setDraggingBlog] = useState<BlogPost | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleDragStart = (blog: BlogPost) => {
    setDraggingBlog(blog);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent, targetBlog: BlogPost) => {
    e.preventDefault();
    if (draggingBlog) {
      setBlogs((prevBlogs) => {
        const updatedBlogs = [...prevBlogs];
        const draggingIndex = updatedBlogs.findIndex(blog => blog.id === draggingBlog.id);
        const targetIndex = updatedBlogs.findIndex(blog => blog.id === targetBlog.id);
        ;[updatedBlogs[draggingIndex], updatedBlogs[targetIndex]] = 
        [updatedBlogs[targetIndex], updatedBlogs[draggingIndex]];
        return updatedBlogs;
      });
      setDraggingBlog(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, blog: BlogPost) => {
    setDraggingBlog(blog);
    setTouchStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingBlog) e.preventDefault();
  };
  const handleTouchEnd = (e: React.TouchEvent, targetBlog: BlogPost) => {
    e.preventDefault();
    if (draggingBlog && touchStartY !== null) {
      const touchEndY = e.changedTouches[0].clientY;
      const targetIndex = blogs.findIndex(blog => blog.id === targetBlog.id);
      const draggingIndex = blogs.findIndex(blog => blog.id === draggingBlog.id);

      if (draggingIndex !== -1 && targetIndex !== -1 && draggingIndex !== targetIndex) {
       setBlogs((prevBlogs) => {
        const updatedBlogs = [...prevBlogs];
        [updatedBlogs[draggingIndex], updatedBlogs[targetIndex]] =
          [updatedBlogs[targetIndex], updatedBlogs[draggingIndex]];
        return updatedBlogs;
      });
    }
    setDraggingBlog(null);
    setTouchStartY(null);
    }
  };

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


  return (
    <div className="pt-4">
      <ul>
        {blogs.map(blog => (
          <li 
            key={blog.id}
            draggable
            onDragStart={() => handleDragStart(blog)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, blog)}
            onTouchStart={(e) => handleTouchStart(e, blog)}
           // onTouchMove={handleTouchMove}
            onTouchEnd={(e) => handleTouchEnd(e, blog)}
            className={`mb-4 rounded-xl ${draggingBlog?.id === blog.id ? 'bg-primary' : ''}`}
          >
            <Blog blog={blog} handleDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListBlogs;