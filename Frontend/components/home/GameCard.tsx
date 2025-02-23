import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { parseDate, parseTime } from "@/utils/dateparser";
import { Game } from "@/types/database_types";


const GameCard = ({ game }: { game: Game} ) => {
  return (
    <Card className="w-[200px] h-[200px]">
      <CardHeader>
        <CardTitle>{parseDate(game.gameDate)}</CardTitle>
        <CardDescription>klo: {parseTime(game.gameDate)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">{game.homeTeam}-{game.awayTeam}</div>
          <div className="text-center mt-4">
            {(Date.now() > (new Date(game.gameDate).getTime()) ) ? 
            (game.homeScore ? `${game.homeScore} - ${game.awayScore}`: "Tulos puuttuu") 
            : "Ei pelattu"}
          </div>
        </div>
      </CardContent>
    </Card> 
  )
}

export default GameCard
