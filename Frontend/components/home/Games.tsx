import GameCard from "./GameCard";
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Game, Season } from "@/types/database_types";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const fetchGames = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/games/season/current`, {
    next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') }, 
  });
  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }
  return res.json();
};

const fetchActiveSeason = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/seasons/current`, {
    next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') }, 
  });
  if (!res.ok) {
    throw new Error("Failed to fetch active season");
  }  
  return res.json();
};


const Games = async () => {
  let games: Game[] = [];
  let activeSeason: Season | null = null;

  try {
    games = await fetchGames();
    activeSeason = await fetchActiveSeason();
  } catch (error) {
    console.error("Error fetching games:", error);
    return (
      <div className="w-3/4 mx-auto mb-4">
        <p className="text-center text-2xl">Failed to load games</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="w-3/4 h-3 mx-auto">
        <p className="text-center text-2xl">Ei pelejä</p>
      </div>  
    );
  }

  return (
    <div className="w-3/4 max-w-screen-lg mx-auto pl-2 pr-2">
      <div className="text-center md:text-left text-2xl mb-4">
        {activeSeason?.name}
      </div>
      <Carousel className="w-full">
          <CarouselContent>
            {games.sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime()).map((game) => (
              <CarouselItem key={game.id} className="flex items-center justify-center basis-4/7 sm:basis-3/7 md:basis-2/7 lg:basis-1/4">
                <GameCard game={game} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-accent"/>
          <CarouselNext className="bg-accent"/>
      </Carousel>
      
      <Link className="flex mt-3" href="/games">
      <Button className="text-white flex items-center justify-center ml-auto">
        Kaikki pelit
        <ArrowRightIcon
          className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
          size={16}
          aria-hidden="true"
        />
      </Button>
    </Link>
    </div>
  ); 
}; 


export default Games;
