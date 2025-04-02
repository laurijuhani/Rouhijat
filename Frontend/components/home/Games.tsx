import GameCard from "./GameCard";
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Game } from "@/types/database_types";

const fetchGames = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/games/season/current`, {
    next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') }, 
  });
  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }
  return res.json();
};


const Games = async () => {
  let games: Game[] = [];

  try {
    games = await fetchGames();
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
      <Carousel className="w-full">
          <CarouselContent>
            {games.map((game) => (
              <CarouselItem key={game.id} className="flex items-center justify-center basis-4/7 sm:basis-3/7 md:basis-2/7 lg:basis-1/4">
                <GameCard game={game} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-accent"/>
          <CarouselNext className="bg-accent"/>
      </Carousel>
    </div>
  ); 
}; 


export default Games;
