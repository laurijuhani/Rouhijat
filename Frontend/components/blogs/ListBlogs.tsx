import Cookies from "js-cookie";
import { BlogPost } from "@/types/database_types";
import { useEffect, useState } from "react";

const ListBlogs = () => {
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

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id}>
          <p>{blog.title}</p>
          <p>{blog.content}</p>
          <p>Created at: {blog.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default ListBlogs;