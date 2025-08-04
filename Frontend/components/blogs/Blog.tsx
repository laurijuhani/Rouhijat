import { BlogPost } from "@/types/database_types";
import { formatDate } from "date-fns";
import { Button } from "../ui/button";
import { GripVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";

interface BlogProps {
  blog: BlogPost;
  handleDelete: (id: number) => void;
}

const Blog = ({ blog, handleDelete }: BlogProps) => {
  return (
    <div className="flex flex-row justify-between border border-secondary-foreground py-4 px-2 mb-4 rounded-xl shadow-sm">
      <p>{blog.title}</p>
      <p className="flex text-center mr-2">Luotu: {formatDate(blog.createdAt, "dd.MM.yyyy HH.mm")}</p>
      <div className="flex flex-row items-center space-x-2">
        <Link href={`/blogs/${blog.id}`}>
          <Button>
            <Pencil className="text-foreground" />
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={() => handleDelete(blog.id)}
        >
          <Trash />
        </Button>
        <GripVertical />
      </div>
    </div>
  );
};

export default Blog;