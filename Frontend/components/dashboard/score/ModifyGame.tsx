import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { Game, Goalie, PlayerPointsData, Season } from "@/types/database_types";
import { parseDateString, parseTime } from "@/utils/dateparser";
import { usePlayers } from "@/context/PlayersContext";
import PlayerPoints from "./PlayerPoints";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/context/ToastContext";
import { LoaderCircleIcon } from "lucide-react";
import { checkGamesEqual, modifiedPoints } from "@/utils/gamemodify";
import GameDetails from "./forms/GameDetails";
import SeasonSelector from "./forms/SeasonSelector";
import Fetch from "@/utils/fetch";
import GoalieSelector from "./forms/GoalieSelector";

interface ModifyGameProps {
  game: Game; 
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  seasons: Season[];
}


const ModifyGame = ({ game, setGames, seasons }: ModifyGameProps) => {
  const { players, fetchPlayers, goalies } = usePlayers();
  const [date, setDate] = useState<Date | undefined>(new Date(game.gameDate));
  const [inputTime, setInputTime] = useState<string>(parseTime(game.gameDate));
  const [inputDate, setInputDate] = useState<string>(parseDateString(game.gameDate));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [playerPoints, setPlayerPoints] = useState<{ [key: number]: [number, number, number] }>({});
  const [originalPoints, setOriginalPoints] = useState<PlayerPointsData[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(seasons.find((season) => season.id === game.seasonId) || null);
  const [played, setPlayed] = useState(false);
  const [selectedGoalie, setSelectedGoalie] = useState<Goalie | null>(null); 
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
        const data = await Fetch.get<PlayerPointsData[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/points/${game.id}`, {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        });

        const points: { [key: number]: [number, number, number] } = {};
        data.forEach((point) => {
          points[point.playerId] = [
            point.goals,
            point.assists,
            point.pm
          ];
        });
        setPlayerPoints(points);     
        setOriginalPoints(data);   
        setSelectedGoalie(goalies.find((goalie) => goalie.id === game.goalieId) || null);
      } catch (error) {
        console.error('Error fetching player points:', error);
      } finally {
        setIsFetching(false);
      }
    };
  
    if (isDialogOpen) {
      fetchPlayerPoints();
    }
  }, [isDialogOpen, game.id, game.goalieId, goalies]);

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
      seasonId: selectedSeason?.id || game.seasonId,
      goalieId: selectedGoalie?.id || null,
    };

    if (!checkGamesEqual(game, newGame)) {      
      try {
        await Fetch.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${game.id}`, newGame, {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        });

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
        await Fetch.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/points/${game.id}`, { playerData: newPoints }, {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        });
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
              <SeasonSelector
                seasons={seasons}
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
              />
              <GameDetails 
                game={game}
                played={played}
                inputDate={inputDate}
                inputTime={inputTime}
                date={date}
                errors={errors}
                handleDateInputChange={handleDateInputChange}
                handleTimeInputChange={handleTimeInputChange}
                handleDateChange={handleDateChange}
              />
              {played && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    
                  {isFetching ? (
                    <div className="col-span-4 flex justify-center items-center">
                      <LoaderCircleIcon className="animate-spin" size={24} aria-hidden="true" />
                    </div>
                  ) : (
                    <>
                    <Label className="col-span-1 text-right">Pelaaja</Label>
                    <Label className="col-span-1 text-right">Maalit</Label>
                    <Label className="col-span-1 text-right">Syötöt</Label>
                    <Label className="col-span-1 text-center">+/-</Label>
                    {players.map((player) => (
                      <div key={player.id} className="col-span-4">
                        <PlayerPoints 
                        player={player} 
                        playerPoints={playerPoints}
                        setPlayerPoints={setPlayerPoints}
                        /> 
                      </div>
                    ))}

                    <div className="col-span-4">
                      <GoalieSelector
                        goalies={goalies}
                        selectedGoalie={selectedGoalie}
                        setSelectedGoalie={setSelectedGoalie}
                      />
                    </div>
                    </>
                  )}
                    </div>
                </>
              )}
            </div>
            <DialogFooter className="flex flex-row gap-3 justify-end border-t py-4">
              <DialogClose asChild>
                <Button type="button" variant='default' disabled={isLoading} className="max-w-[fit-content] text-foreground">
                  Sulje
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={isLoading}
                data-loading={isLoading}
                variant="outline"
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
};

export default ModifyGame;
