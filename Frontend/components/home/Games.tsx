import GameCard from "./GameCard"
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Game } from "@/types/database_types";

const fetchGames = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/games`, {
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
      <div className="w-3/4 h-3 mx-auto">
        <p className="text-center text-2xl">Failed to load games</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="w-3/4 h-3 mx-auto">
        <p className="text-center text-2xl">Ei pelejä</p>
      </div>  
    )
  }

  return (
    <div className="w-3/4 mx-auto pl-2 pr-2">
      <Carousel
      opts={{
        align: "center",
      }}
      className="w-full max-w-screen-lg"
      >
          <CarouselContent>
            {games.map((game) => (
              <CarouselItem key={game.id} className="flex items-center justify-center sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                <GameCard game={game} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
      </Carousel>
    </div>
  ); 
}; 


export default Games
