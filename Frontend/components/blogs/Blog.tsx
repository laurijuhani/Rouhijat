import { BlogPost } from "@/types/database_types";
import { formatDate } from "date-fns";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";


/**
 * TODO
 * - Add modify button which directs to /blogs/[id]
 */

interface BlogProps {
  blog: BlogPost;
  handleDelete: (id: number) => void;
}

const Blog = ({ blog, handleDelete }: BlogProps) => {
  return (
    <div className="flex flex-row justify-between border border-secondary-foreground p-4 mb-4 rounded-xl shadow-sm">
      <p>{blog.title}</p>
      <p>Luotu: {formatDate(blog.createdAt, "dd.MM.yyyy HH.mm")}</p>
      <div className="flex flex-row space-x-2">
        <Button
          onClick={() => {
            // Navigate to the edit page
          }}
        >
          <Pencil className="text-foreground" />
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDelete(blog.id)}
        >
          <Trash />
        </Button>

      </div>
    </div>
  );
};

export default Blog;