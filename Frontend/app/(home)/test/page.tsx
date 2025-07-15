import RenderPost from "@/components/tiptap/RenderPost";
import { Suspense } from "react";

const fetchPosts = async () => {
  try {    
    const res = await fetch(`${process.env.PRIVATE_BACKEND_URL}/history-posts`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') }, // Use revalidate for successful fetch
    });
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

interface Post {
  content: string;
  title: string;
  createdAt: string;
}


const Page = async () => {
  const posts: Post[] = await fetchPosts();

  if (!posts || posts.length === 0) {
    return <div>No posts available</div>;
  }
  
  return (
    <div>
      {posts.map((post, index) => (
        <Suspense key={index} fallback={<div>Loading post...</div>}>
          <RenderPost key={index} content={post.content} />
        </Suspense>
      ))}
    </div>
  );
};


export default Page;


