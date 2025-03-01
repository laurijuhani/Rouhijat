import BackButton from "@/components/basics/BackButton";
import ShowPoints from "@/components/games/ShowPoints";
import { GameAndPoints } from "@/types/database_types";
import { getDateAndWeekday, parseTime } from "@/utils/dateparser";

interface GamePageProps {
  params: {
    id: number;
  }; 
}
const GamePage = async ({ params }: GamePageProps) => {
  const { id } = await params; 
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${id}`, {
    next: { revalidate: 6 }, // TODO: Modify this to 10 minutes in production
  });
  const game: GameAndPoints = await res.json();
  
  return (
    <div className="p-4">
      <BackButton />
      
      <div className="flex flex-col items-center mt-8 mb-8">
        <p className="font-bold pb-3">{parseTime(game.gameDate)} | {getDateAndWeekday(game.gameDate)}</p>
        <h2 className="text-xl">{game.homeTeam} {game.homeScore} - {game.awayScore} {game.awayTeam}</h2>
      </div>



      <ShowPoints gamePoints={game.points} />
    </div>
  );
};

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/games`);
  const games = await res.json();

  return games.map((game: { id: number }) => ({
    id: game.id.toString(),
  }));
}




export default GamePage
