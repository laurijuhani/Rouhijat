import BackButton from "@/components/basics/BackButton";
import ShowPoints from "@/components/games/ShowPoints";
import { GameAndPoints } from "@/types/database_types";
import { getDateAndWeekday, parseTime } from "@/utils/dateparser";

type Params = Promise<{ id: string }>;

const GamePage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  let game: GameAndPoints | null = null;

  try {
    const res = await fetch(`${process.env.INTERNAL_BACKEND_URL}/games/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch game data");
    }

    game = await res.json();
  } catch (error) {
    console.error("Error fetching game data:", error);
  }

  if (!game) {
    return (
      <div className="p-4">
        <BackButton />
        <div className="flex flex-col items-center mt-8 mb-8">
          <h2 className="text-xl">Game not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <BackButton />

      <div className="flex flex-col items-center mt-8 mb-8">
        <p className="font-bold pb-3">{parseTime(game.gameDate)} | {getDateAndWeekday(game.gameDate)}</p>
        <h2 className="text-xl">{game.homeTeam} {game.homeScore} - {game.awayScore} {game.awayTeam}</h2>
      </div>

      <ShowPoints gamePoints={game.points} />

      {game.goalie && (
        <div className="flex flex-col items-center mt-8 mb-8">
          <h2 className="text-xl">Maalivahti:</h2>
          <p>#{game.goalie.number} {game.goalie.name}</p>
        </div>
      )}

    </div>
  );
};

export default GamePage;