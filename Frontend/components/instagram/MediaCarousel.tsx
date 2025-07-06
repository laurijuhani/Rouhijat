"use client";

import {
  Carousel,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { JSX, useEffect, useState } from "react";

interface MediaCarouselProps {
  itemsLength: number;
  items: JSX.Element; 
}


const MediaCarousel = ({ itemsLength, items }: MediaCarouselProps) => {
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
    <>
      <Carousel setApi={setCarouselApi}>
        {items}

      {itemsLength > 1 && (
        <>
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
        </>
      )}
      </Carousel>
        {itemsLength > 1 && (
          <div className="mt-1 flex justify-center space-x-2 z-20">
          {Array.from({ length: itemsLength }).map((_, index) => (
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
    </>
  );
};

export default MediaCarousel;
