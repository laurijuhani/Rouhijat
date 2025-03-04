import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { format, parse } from "date-fns"
import { Game, PlayerPointsData } from "@/types/database_types"
import { parseDateString, parseTime } from "@/utils/dateparser"
import { usePlayers } from "@/context/PlayersContext"
import PlayerPoints from "./PlayerPoints"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/context/ToastContext";
import { LoaderCircleIcon } from "lucide-react";
import { checkGamesEqual, modifiedPoints } from "@/utils/gamemodify"

interface ModifyGameProps {
  game: Game; 
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
}


const ModifyGame = ({ game, setGames }: ModifyGameProps) => {
  const { players, fetchPlayers } = usePlayers();
  const [date, setDate] = useState<Date | undefined>(new Date(game.gameDate));
  const [inputTime, setInputTime] = useState<string>(parseTime(game.gameDate));
  const [inputDate, setInputDate] = useState<string>(parseDateString(game.gameDate));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [playerPoints, setPlayerPoints] = useState<{ [key: number]: [number, number] }>({});
  const [originalPoints, setOriginalPoints] = useState<PlayerPointsData[]>([]);
  const [played, setPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
      setPlayed(Date.now() > (date?.getTime() || Infinity));
      if (played) {
        fetchPlayers();
      }
  }, [date, fetchPlayers, played]);

  useEffect(() => {
    const fetchPlayerPoints = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/points/' + game.id, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data: PlayerPointsData[] = await response.json();
        const points: { [key: number]: [number, number] } = {};
        data.forEach((point) => {
          points[point.playerId] = [
            point.goals,
            point.assists
          ];
        });
        setPlayerPoints(points);     
        setOriginalPoints(data);   
      } catch (error) {
        console.error('Error fetching player points:', error);
      } finally {
        setIsFetching(false);
      }
    };
  
    if (isDialogOpen) {
      fetchPlayerPoints();
    }
  }, [isDialogOpen, game.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors: { [key: string]: string } = {};

    const form = e.target as HTMLFormElement;
    const homeTeam = form.homeTeam.value;
    const awayTeam = form.awayTeam.value;
    const homeScore = form.homeScore.value;
    const awayScore = form.awayScore.value;
    setErrors({});
    const combinedDateTime = getCombinedDateTime();
    if (!combinedDateTime) {
      newErrors.date = 'Päivämäärä ja aika on pakollinen';
    }
  
    if (!homeTeam) {
      newErrors.homeTeam = 'Kotijoukkue on pakollinen';
    }
    if (!awayTeam) {
      newErrors.awayTeam = 'Vierasjoukkue on pakollinen';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newGame: Game = {
      id: game.id,
      homeTeam,
      awayTeam,
      homeScore: homeScore ? parseInt(homeScore) : null,
      awayScore: awayScore ? parseInt(awayScore) : null,
      gameDate: combinedDateTime?.toISOString() || game.gameDate,
    }

    if (!checkGamesEqual(game, newGame)) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/games/' + game.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newGame)
        });
    
        if (!response.ok) {
          throw new Error('Failed to update game');
        }

        setGames((prev) => prev.map((g) => (g.id === game.id ? newGame : g)));
      } catch (error) {
        console.error('Error updating game:', error);
        showToast('error', 'Virhe päivitettäessä peliä', 'Yritä myöhemmin uudelleen');
        setIsLoading(false);
        setIsDialogOpen(false);
        return;
      }
    }     

    const newPoints = modifiedPoints(originalPoints, playerPoints);
    if (newPoints.length > 0) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/points/' + game.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ playerData: newPoints })
        });

        if (!response.ok) {
          throw new Error('Failed to update player points');
        }


      } catch (error) {
        console.error('Error updating player points:', error);
        showToast('error', 'Virhe päivitettäessä pelaajien pisteitä', 'Yritä myöhemmin uudelleen');
        setIsLoading(false);
        setIsDialogOpen(false);
        return;
      }
    }
    
    setIsLoading(false);
    showToast('success', 'Peli päivitetty', 'Pelin tiedot on päivitetty onnistuneesti');
    setIsDialogOpen(false);
  }; 

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setInputDate(format(date, 'dd.MM.yyyy'));
      setErrors((prev) => ({ ...prev, date: '' }));
    } else {
      setInputDate('');
    }

  }; 

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputDate(value);
    const parsedDate = parse(value, 'dd.MM.yyyy', new Date());
    if (!isNaN(parsedDate.getTime())) {
      setDate(parsedDate);
      setErrors((prev) => ({ ...prev, date: '' }));
    } else {
      setDate(undefined);
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputTime(value);
    setErrors((prev) => ({ ...prev, date: '' }));
  };

  const getCombinedDateTime = (): Date | null => {
    if (!date || !inputTime) return null;
    const [hours, minutes] = inputTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes);
    return combinedDate;
  };



  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="max-w-[fit-content] max-h-[fit-content]">
          <Image src="/icons/edit.svg" alt="Edit" width={12} height={12} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] max-h-[80%]">
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Muokkaa peliä</DialogTitle>
            <DialogDescription>
              Muokkaa pelin tietoja
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Päivämäärä" className="text-right">
                  Päivämäärä
                </Label>
                <div className="relative col-span-2">
                  <Input id="date" value={inputDate} onChange={handleDateInputChange} className="w-full pr-10" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "absolute right-0 top-0 h-full px-3 py-2",
                          !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                        />
                    </PopoverContent>
                  </Popover>
                </div>
                <Input id="time" type="clock" value={inputTime} placeholder="00:00" onChange={handleTimeInputChange} className="col-span-1"/>
                {errors.date && <p className="text-red-500 text-sm col-span-4 text-center">{errors.date}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="homeTeam" className="text-right">
                  Kotijoukkue
                </Label>
                <Input id="homeTeam"  className="col-span-3" defaultValue={game.homeTeam}/>
                {errors.homeTeam && <p className="text-red-500 text-sm col-span-4 text-center">{errors.homeTeam}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="awayTeam" className="text-right">
                  Vierasjoukkue
                </Label>
                <Input id="awayTeam" className="col-span-3" defaultValue={game.awayTeam}/>
                {errors.awayTeam && <p className="text-red-500 text-sm col-span-4 text-center">{errors.awayTeam}</p>}
              </div>
              {played && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="score" className="text-center col-span-4">
                      Tulos
                    </Label>
                    <div className="col-span-4 flex justify-center items-center gap-2">
                      H<Input id="homeScore" type="number" defaultValue={game.homeScore || 0} className="w-16 text-center" />
                      <span>-</span>
                      <Input id="awayScore" type="number" defaultValue={game.awayScore || 0} className="w-16 text-center" />A
                    </div>

                  {isFetching ? (
                    <div className="col-span-4 flex justify-center items-center">
                      <LoaderCircleIcon className="animate-spin" size={24} aria-hidden="true" />
                    </div>
                  ) : (
                    players.map((player) => (
                      <div key={player.id} className="col-span-4">
                        <PlayerPoints 
                        player={player} 
                        playerPoints={playerPoints}
                        setPlayerPoints={setPlayerPoints}
                        /> 
                      </div>
                    ))
                  )}
                    </div>
                </>
              )}
            </div>
            <DialogFooter className="flex flex-row gap-3 justify-end border-t py-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isLoading} className="max-w-[fit-content]">
                  Sulje
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={isLoading}
                data-loading={isLoading}
                className="max-w-[fit-content] group relative disabled:opacity-100"
              >
                <span className="group-data-[loading=true]:text-transparent">Tallenna muutokset</span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />
                </div>
              )}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ModifyGame
