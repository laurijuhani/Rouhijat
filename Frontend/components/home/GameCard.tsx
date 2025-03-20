import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { parseDate, parseTime } from "@/utils/dateparser";
import { Game } from "@/types/database_types";
import Link from "next/link";


const GameCard = ({ game }: { game: Game} ) => {
  const content = (
    <Card className="w-[200px] h-[200px]">
      <CardHeader>
        <CardTitle>{parseDate(game.gameDate)}</CardTitle>
        <CardDescription>klo: {parseTime(game.gameDate)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">{game.homeTeam}-{game.awayTeam}</div>
          <div className="text-center mt-4">
            {((game.homeScore !== null) ? `${game.homeScore} - ${game.awayScore}`: "Tulosta ei saatavilla")}
          </div>
        </div>
        {(game.homeScore !== null) && 
          <div className="flex justify-end text-sm mt-4">
            Lisätietoja -&gt;
          </div>
        }
      </CardContent>
    </Card> 
  )

  return game.homeScore ? (
    <Link href={`/games/${game.id}`}>
      {content}
    </Link>
  ) : (
    content
  );
}

export default GameCard
