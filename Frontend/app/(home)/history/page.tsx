import RenderPost from "@/components/tiptap/RenderPost";
import { Timeline } from "@/components/ui/timeline";
import { BlogPost } from "@/types/database_types";

const fetchPosts = async () => {
  try {    
    const res = await fetch(`${process.env.PRIVATE_BACKEND_URL}/history-posts`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') }, // Use revalidate for successful fetch
    });
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    const blogs = await res.json() as BlogPost[];
    return blogs.map((post) => ({
      title: post.title,
      content: <RenderPost content={post.content} />,
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];  
  }
};




const Page = async () => {
  const data: { title: string, content: React.JSX.Element}[] = await fetchPosts();  

  if (!data || data.length === 0) {
    return <div>No posts available</div>;
  }
  
  return (
    <div>
      <Timeline data={data} />
    </div>
  );
};


export default Page;