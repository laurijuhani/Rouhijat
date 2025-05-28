import { Game } from "@/types/database_types";
import { getDateAndWeekday, parseTime } from "@/utils/dateparser";
import Link from "next/link";


interface Props {
  game: Game;
}

const GameInfo = ({ game }: Props) => {  
  const content = (
    <div className="mb-2 grid grid-cols-1 md:grid-cols-3 gap-2 bg-primary py-2 md:py-4 rounded-md">
      <div className="flex justify-between md:block ml-2">
        <div className="flex gap-1">
          <span>{getDateAndWeekday(game.gameDate)}</span>
          <span>klo: {parseTime(game.gameDate)}</span>
        </div>
        <div className="md:hidden">
          {game.homeScore !== null && (
            <div className="flex justify-end text-sm mr-2">
              Lisätietoja -&gt;
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow text-center md:text-left">
        <p className="col-span-2">
          {game.homeTeam} {game.homeScore !== null ? game.homeScore : "‎ ‎"} - {" "}
          {game.awayScore !== null ? game.awayScore : "‎ ‎"} {game.awayTeam}
        </p>
      </div>

      <div className="hidden md:block mr-2">
        {game.homeScore !== null && (
          <div className="flex justify-end text-sm mt-1">
            Lisätietoja -&gt;
          </div>
        )}
      </div>
    </div>
  );

  return game.homeScore !== null ? (
    <Link href={`/games/${game.id}`}>
      {content}
    </Link>
  ) : (
    content
  );
};

export default GameInfo;
