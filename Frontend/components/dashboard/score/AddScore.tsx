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
import { useToast } from "@/context/ToastContext";
import { LoaderCircleIcon } from "lucide-react";

interface AddScoreProps {
  game: Game
  setGames: React.Dispatch<React.SetStateAction<Game[]>>
}

const AddScore = ({ game, setGames }: AddScoreProps) => {
  const { players, fetchPlayers } = usePlayers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [playerPoints, setPlayerPoints] = useState<{ [key: number]: [number, number, number] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isDialogOpen) {
      fetchPlayers();
    }
  }, [isDialogOpen, fetchPlayers]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const homeScore = form.homeScore.value;
    const awayScore = form.awayScore.value;
    setError('');

    if (!homeScore || !awayScore) {
      setError('Tulos on pakollinen');
      setIsLoading(false);
      return;
    }

    const playerData = Object.entries(playerPoints).map(([playerId, [goals, assists, pm]]) => ({
      playerId: parseInt(playerId),
      goals,
      assists,
      pm
    }));
    
    try {
      const res1 = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/games/score/' + game.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore)
        })
      });

      if (!res1.ok) {
        showToast("error", "Virhe", "Tuloksen ja pisteiden lisääminen epäonnistui");
        setIsDialogOpen(false);
        console.error("Error adding game:", res1);
        return
      }
        
      const res2 = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/points/' + game.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          playerData
        })
      });

      if (!res2.ok) {
        showToast("error", "Virhe", "Pisteiden lisääminen epäonnistui");
        setIsDialogOpen(false);
        console.error("Error adding game:", res2);
        return
      }


      showToast("success", "Onnistui", "Tulos lisätty onnistuneesti");
      setIsDialogOpen(false);
      setGames((games) => games.map((g) => g.id === game.id ? { ...g, homeScore: parseInt(homeScore), awayScore: parseInt(awayScore) } : g));
    } catch (error) {
      console.error("Error adding game:", error);
      setError('Jotain meni pieleen');
      setIsDialogOpen(false);
      showToast("error", "Virhe", "Tuloksen lisääminen epäonnistui");
    } finally {
      setIsLoading(false);
    }  
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
            <Label className="col-span-1 text-right">Pelaaja</Label>
            <Label className="col-span-1 text-right">Maalit</Label>
            <Label className="col-span-1 text-right">Syötöt</Label>
            <Label className="col-span-1 text-center">+/-</Label>
             
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
              <Button variant="secondary" disabled={isLoading}>Sulje</Button>
            </DialogClose>
            <Button 
              variant="outline" 
              type="submit"
              disabled={isLoading}
              data-loading={isLoading}
               className="group relative disabled:opacity-100"
            >
              <span className="group-data-[loading=true]:text-transparent">Tallenna</span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddScore