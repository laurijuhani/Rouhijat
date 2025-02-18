import GameCard from "./GameCard"
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { GameData } from "@/types/database_types";

const dummy_data: GameData[] = [
  {
    date: new Date(),
    homeTeam: "Rouhijat",
    awayTeam: "Kärpät",
    score: null,
  },
  {
    date: new Date("2022-01-01"),
    homeTeam: "Rouhijat",
    awayTeam: "Kärpät",
    score: null,
  },
  {
    date: new Date("2022-01-02"),
    homeTeam: "Rouhijat",
    awayTeam: "Kärpät",
    score: null,
  },
  {
    date: new Date("2022-01-03"),
    homeTeam: "Rouhijat",
    awayTeam: "Kärpät",
    score: null,
  },
  {
    date: new Date("2022-01-04"),
    homeTeam: "Rouhijat",
    awayTeam: "Kärpät",
    score: null,
  },
]


const Games = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20))

  if (dummy_data.length === 0) {
    return (
      <div className="w-3/4 h-3 mx-auto">
        <p className="text-center text-2xl">Dataa ei saatavilla</p>
      </div>  
    )
  }

  return (
    <div className="w-3/4 mx-auto">
      <Carousel
      opts={{
        align: "center",
      }}
      className="w-full max-w-screen-lg mx-auto"
      >
          <CarouselContent>
            {dummy_data.map((game, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 flex justify-center">
                <GameCard date={game.date} homeTeam={game.homeTeam} awayTeam={game.awayTeam} score={null} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
      </Carousel>
    </div>
  )
}

export default Games
