import { GamePoints } from '@/types/database_types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShowPoints = ({ gamePoints }: { gamePoints: GamePoints[]}) => {
  const sortedPoints = gamePoints.sort((a, b) => {
    const totalPointsA = a.goals + a.assists;
    const totalPointsB = b.goals + b.assists;

    if (totalPointsA === totalPointsB) {
      return b.goals - a.goals; 
    }

    return totalPointsB - totalPointsA;
  });
  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="h-9 py-2">#</TableHead>
            <TableHead className="h-9 py-2">Pelaaja</TableHead>
            <TableHead className="h-9 py-2">Pisteet</TableHead>
            <TableHead className="h-9 py-2">+/-</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPoints.map((point, index) => (
            <TableRow key={index}>
              <TableCell className="py-2">{point.player.number}</TableCell>
              <TableCell className="py-2">{point.player.name}</TableCell>
              <TableCell className="py-2">{point.goals} + {point.assists} = {point.goals + point.assists}</TableCell>
              <TableCell className="py-2">{point.pm}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ShowPoints


