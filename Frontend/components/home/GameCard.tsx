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
          <div className="flex flex-row gap-1">
            <p>{game.homeTeam}</p>
            -
            <p>{game.awayTeam}</p>
          </div>
          {new Date(game.gameDate) < new Date() && (            
            <div className="text-center mt-4">
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
