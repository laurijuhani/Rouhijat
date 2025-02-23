import { Game } from "@/types/database_types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { usePlayers } from "@/context/PlayersContext"
import PlayerPoints from "./PlayerPoints"

const AddScore = ({ game }: { game: Game }) => {
  const { players, fetchPlayers } = usePlayers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [playerPoints, setPlayerPoints] = useState<{ [key: number]: [number, number] }>({});

  useEffect(() => {
    if (isDialogOpen) {
      fetchPlayers();
    }
  }, [isDialogOpen, fetchPlayers]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Send a POST request to the backend with the new score data and player stats
    const form = e.target as HTMLFormElement;
    const homeScore = form.homeScore.value;
    const awayScore = form.awayScore.value;
    setError('');

    if (!homeScore || !awayScore) {
      setError('Tulos on pakollinen');
      return;
    }


    

    console.log(homeScore, awayScore);
    console.log(playerPoints);
    
    
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Lisää tulos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lisää tulos</DialogTitle>
          <DialogDescription>
            Lisää pelille {game.homeTeam} -- {game.awayTeam} tulos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-center col-span-4">
              Tulos
            </Label>
            <div className="col-span-4 flex justify-center items-center gap-2">
             H<Input id="homeScore" type="number" className="w-16 text-center" />
              <span>-</span>
              <Input id="awayScore" type="number" className="w-16 text-center" />A
            </div>
            {error && <p className="text-red-500 text-sm col-span-4 text-center">{error}</p>}
         
            <Label htmlFor="name" className="text-left col-span-4">
              Merkkaa oliko pelaaja kokoonpanossa ja syöttöjen sekä maalien määrä.
              Nollat voi jättää tyhjäksi.
            </Label>
            <Label htmlFor="goals" className="text-right col-span-2">
              Maalit
            </Label>
            <div className="col-span-1"></div>
            <Label htmlFor="assists" className="text-left col-span-1">
              Syötöt
            </Label>
             
            {players.map((player) => (
              <div key={player.id} className="col-span-4 flex justify-center items-center gap-2">
                <PlayerPoints 
                  player={player} 
                  playerPoints={playerPoints}
                  setPlayerPoints={setPlayerPoints}
                /> 
              </div>
            ))}
          </div>
          <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button variant="secondary">Sulje</Button>
            </DialogClose>
            <Button variant="outline" type="submit">
              Tallenna
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddScore