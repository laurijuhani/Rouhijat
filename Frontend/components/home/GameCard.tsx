import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseDate } from "@/utils/dateparser";
import { GameData } from "@/types/database_types";


const GameCard = ({ date, homeTeam, awayTeam, score }: GameData) => {
  return (
    <Card className="w-[200px] h-[200px]">
      <CardHeader>
        <CardTitle>{parseDate(date)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">{homeTeam}</div>
          <div className="text-center">{awayTeam}</div>
          <div className="text-center">{score ? `${score[0]} - ${score[1]}` : "Ei pelattu"}</div>
        </div>
      </CardContent>
    </Card> 
  )
}

export default GameCard
