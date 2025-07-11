import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { parseDate, parseTime } from "@/utils/dateparser";
import { Game } from "@/types/database_types";
import Link from "next/link";


const GameCard = ({ game }: { game: Game} ) => {  
  const content = (
    <Card className="w-[200px] h-[200px] border-2 relative">
      <CardHeader>
        <CardTitle>{parseDate(game.gameDate)}</CardTitle>
        <CardDescription>klo: {parseTime(game.gameDate)}</CardDescription>
      </CardHeader>
      <CardContent className="absolute top-[5.5rem] left-1/2 transform -translate-x-1/2 w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row flex-wrap items-center justify-center w-full max-w-[160px] mx-auto">
            <p className="flex items-center text-center break-words">{game.homeTeam}</p>
            <p className="flex items-center text-center font-bold mx-1">-</p>
            <p className="flex items-center text-center break-words">{game.awayTeam}</p>
          </div>
          {new Date(game.gameDate) < new Date() && (            
            <div className="text-center mt-2">
              {((game.homeScore !== null) ? `${game.homeScore} - ${game.awayScore}`: "Tulosta ei saatavilla")}
            </div>
          )}
        </div>
      </CardContent>
        {(game.homeScore !== null) && 
          <div className="absolute bottom-1 right-2 text-sm">
            Lisätietoja -&gt;
          </div>
        }
    </Card> 
  );

  return game.homeScore !== null ? (
    <Link href={`/games/${game.id}`}>
      {content}
    </Link>
  ) : (
    content
  );
};

export default GameCard;
