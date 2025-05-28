"use client"; 

import { Picture, Video } from "@/types/database_types";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { HeartIcon, MessageCircleIcon } from "lucide-react";


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

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    }; 

    updateCarouselState();
    carouselApi.on("select", updateCarouselState);
    
    return () => {
      carouselApi.off("select", updateCarouselState);
    };
  }, [carouselApi]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  }; 

  return (
    <div className="md:p-4 items-center">
      <Carousel setApi={setCarouselApi} >
        <CarouselContent>
          {mediaItems.map((item) => (
            <CarouselItem key={item.id} className="flex items-center justify-center">
              {item.type === "picture" ? (
                <Image 
                  src={process.env.NEXT_PUBLIC_PRIVATE_BACKEND_URL + item.display_url} 
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
                  src={process.env.NEXT_PUBLIC_PRIVATE_BACKEND_URL +  (item as Video).video_url}
                  className="w-full rounded"
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="
            hidden md:flex
            absolute md:-left-9 lg:left-0 top-1/2 -translate-y-1/2
            z-10 bg-black/40 hover:bg-black/80 rounded-full w-7 h-7 items-center justify-center
          "
        />
        <CarouselNext
          className="
            hidden md:flex
            absolute md:-right-9 lg:right-0 top-1/2 -translate-y-1/2
            z-10 bg-black/40 hover:bg-black/80 rounded-full w-7 h-7 items-center justify-center
          "
        />
      </Carousel>
        {mediaItems.length > 1 && (
          <div className="mt-1 flex justify-center space-x-2 z-20">
          {Array.from({ length: mediaItems.length }).map((_, index) => (
            <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-black" : "bg-gray-300"
              }`}
              />
            ))}
          </div>
        )}
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
