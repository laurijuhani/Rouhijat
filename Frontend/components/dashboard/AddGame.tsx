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
import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { format, parse } from "date-fns";
import { Game, Season } from "@/types/database_types";
import { useToast } from "@/context/ToastContext";
import GameDetails from "./score/forms/GameDetails";
import Fetch from "@/utils/fetch";

interface AddGameProps {
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  season: Season | null; 
}

const AddGame = ({ setGames, season }: AddGameProps) => {
  const [date, setDate] = useState<Date>();
  const [inputTime, setInputTime] = useState<string>("");
  const [inputDate, setInputDate] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors: { [key: string]: string } = {};

    const form = e.target as HTMLFormElement;
    const homeTeam = form.homeTeam.value;
    const awayTeam = form.awayTeam.value;
    const homeScore = form.homeScore?.value;
    const awayScore = form.awayScore?.value;
    setErrors({});
    const combinedDateTime = getCombinedDateTime();
    if (!combinedDateTime) {
      newErrors.date = "Päivämäärä ja aika on pakollinen";
    }

    if (!homeTeam) {
      newErrors.homeTeam = "Kotijoukkue on pakollinen";
    }
    if (!awayTeam) {
      newErrors.awayTeam = "Vierasjoukkue on pakollinen";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const gameData = {
      homeTeam,
      awayTeam,
      gameDate: combinedDateTime,
      homeScore: homeScore ? parseInt(homeScore) : null,
      awayScore: awayScore ? parseInt(awayScore) : null,
      seasonId: season?.id
    };

    try {
      const { json } = await Fetch.post<Game>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games`,
        gameData,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      );
      const data = await json;
      setGames((prev) => [...prev, data]);

      showToast(
        "success",
        "Peli lisätty",
        `Peli ${homeTeam} - ${awayTeam} lisätty onnistuneesti`
      );
      setIsDialogOpen(false); 
    } catch (error) {
      console.error("Error adding game:", error);
      setIsDialogOpen(false);
      showToast("error", "Virhe", "Pelin lisääminen epäonnistui");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setInputDate(format(date, "dd.MM.yyyy"));
      setErrors((prev) => ({ ...prev, date: "" }));
    } else {
      setInputDate("");
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputDate(value);
    const parsedDate = parse(value, "dd.MM.yyyy", new Date());
    if (!isNaN(parsedDate.getTime())) {
      setDate(parsedDate);
      setErrors((prev) => ({ ...prev, date: "" }));
    } else {
      setDate(undefined);
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputTime(value);
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  const getCombinedDateTime = (): Date | null => {
    if (!date || !inputTime) return null;
    const [hours, minutes] = inputTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes);
    return combinedDate;
  };

  const game: Game = {
    id: 0,
    homeTeam: "",
    awayTeam: "",
    gameDate: "",
    homeScore: null,
    awayScore: null,
    seasonId: season?.id || 1, // TODO: change this to actually excpect season
    goalieId: null,
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <Image src="/icons/plus.svg" alt="Lisää peli" width={20} height={20} />
          Lisää peli
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Lisää peli</DialogTitle>
          <DialogDescription>Syötä pelin tiedot</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
          <GameDetails 
                game={game}
                played={Date.now() > (getCombinedDateTime()?.getTime() || Infinity)}
                inputDate={inputDate}
                inputTime={inputTime}
                date={date}
                errors={errors}
                handleDateInputChange={handleDateInputChange}
                handleTimeInputChange={handleTimeInputChange}
                handleDateChange={handleDateChange}
              />
            
          </div>
          <DialogFooter className="flex flex-row gap-3 justify-end">
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
              <span className="group-data-[loading=true]:text-transparent">Lisää peli</span>
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
  );
};

export default AddGame;