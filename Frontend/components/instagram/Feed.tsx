import { IGPost, Profile } from "@/types/database_types";
import ProfileView from "./ProfileView";
import Post from "./Post";


const fetchInstagramData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/posts`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') }, // Use revalidate for successful fetch
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch Instagram data");
    }
    return res.json() as Promise<{ profile: Profile; posts: IGPost[] }>;
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    // Retry immediately on the next load by forcing a fresh fetch
    const retryRes = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/posts`, {
      cache: 'no-store', // Force fresh fetch
    });
    if (!retryRes.ok) {
      throw new Error("Failed to fetch Instagram data on retry");
    }
    return retryRes.json() as Promise<{ profile: Profile; posts: IGPost[] }>;
  }
};

const Feed = async () => {
  let profile: Profile | null = null;
  let posts: IGPost[] = [];

  try {
    ({ profile, posts } = await fetchInstagramData()); 
  } catch {
    return; // Don't render anything if there's an error
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-4">Instagram</h1>
      <ProfileView profile={profile} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2 md:p-4 max-w-6xl mx-auto">
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
