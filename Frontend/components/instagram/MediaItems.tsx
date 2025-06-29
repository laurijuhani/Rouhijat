import {
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Picture, Video } from "@/types/database_types";

type MediaItem = (Picture | Video) & { type: 'picture' | 'video' };

interface MediaItemsProps {
  mediaItems: MediaItem[];
}

const MediaItems = ({ mediaItems }: MediaItemsProps) => {
  return (
    <CarouselContent>
          {mediaItems.map((item) => (
            <CarouselItem key={item.id} className="flex items-center justify-center">
              {item.type === "picture" ? (
                <Image 
                  src={process.env.PRIVATE_BACKEND_URL + item.display_url} 
                  alt="" 
                  width={500} 
                  height={500} 
                  className="rounded" 
                />
              ) : (
                <video
                  controls
                  autoPlay
                  muted
                  src={process.env.PRIVATE_BACKEND_URL +  (item as Video).video_url}
                  className="w-full rounded"
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
  );
};

export default MediaItems;
