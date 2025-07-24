import { BlogPost } from "@/types/database_types";
import { formatDate } from "date-fns";


/**
 * TODO
 * - Add modify button which directs to /blogs/[id]
 * - Add delete button which deletes the blog post
 */


const Blog = ({ blog }: { blog: BlogPost}) => {
  return (
    <div className="border border-secondary-foreground p-4 mb-4 rounded-xl shadow-sm">
      <p>{blog.title}</p>
      <p>Luotu: {formatDate(blog.createdAt, "dd.MM.yyyy HH.mm")}</p>
    </div>
  );
};

export default Blog;