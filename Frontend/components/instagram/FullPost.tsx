import { Suspense, lazy } from "react";
import { Picture, Video } from "@/types/database_types";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import MediaCarousel from "./MediaCarousel";
import MediaLoading from "./MediaLoading";
const LazyMediaItems = lazy(() => import("./MediaItems"));

interface FullPostProps {
  pictures: Picture[];
  videos: Video[];
  likes: number; 
  comment_count: number; 
  caption: string;
}

type MediaItem = (Picture | Video) & { type: 'picture' | 'video' };

const FullPost = ({ pictures, videos, likes, comment_count, caption }: FullPostProps) => {
  const mediaItems: MediaItem[] = [
    ...pictures.map(pic => ({ ...pic, type: 'picture' as const })),
    ...videos.map(video => ({ ...video, type: 'video' as const }))
  ].sort((a, b) => a.order - b.order);

  const items = (
    <Suspense fallback={<MediaLoading />}>
      <LazyMediaItems mediaItems={mediaItems} />
    </Suspense>
  );


  return (
    <div className="md:p-4 items-center">
      <MediaCarousel itemsLength={mediaItems.length} items={items} />

      <div className="flex mt-4">
        <div className="flex items-center space-x-2 mr-3">
          <span className="font-bold">{likes}</span>
          <HeartIcon className="h-5 w-5 mr-1 fill-white stroke-none" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold">{comment_count}</span>
          <MessageCircleIcon className="h-5 w-5 mr-1" />
        </div>
      </div>
      <p className="whitespace-pre-line mt-2">{caption}</p>
    </div>
  );
};

export default FullPost;
