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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { format, parse } from "date-fns";
import { Game } from "@/types/database_types";
import { useToast } from "@/context/ToastContext";

interface AddGameProps {
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

const AddGame = ({ setGames }: AddGameProps) => {
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

    // TODO: Send a POST request to the backend with the new game data
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
    };

    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        console.log(response);
        
        throw new Error("Failed to add game");
      }

      const data: Game = await response.json();
      console.log(data);
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Päivämäärä" className="text-right">
                Päivämäärä
              </Label>
              <div className="relative col-span-2">
                <Input
                  id="date"
                  value={inputDate}
                  onChange={handleDateInputChange}
                  className="w-full pr-10"
                />
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
              <Input
                id="time"
                type="clock"
                value={inputTime}
                placeholder="00:00"
                onChange={handleTimeInputChange}
                className="col-span-1"
              />
              {errors.date && (
                <p className="text-red-500 text-sm col-span-4 text-center">
                  {errors.date}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="homeTeam" className="text-right">
                Kotijoukkue
              </Label>
              <Input id="homeTeam" className="col-span-3" />
              {errors.homeTeam && (
                <p className="text-red-500 text-sm col-span-4 text-center">
                  {errors.homeTeam}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="awayTeam" className="text-right">
                Vierasjoukkue
              </Label>
              <Input id="awayTeam" className="col-span-3" />
              {errors.awayTeam && (
                <p className="text-red-500 text-sm col-span-4 text-center">
                  {errors.awayTeam}
                </p>
              )}
            </div>
            {Date.now() > (date?.getTime() || Infinity) && (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="score" className="text-center col-span-3">
                  Tulos
                </Label>
                <div className="col-span-3 flex justify-center items-center gap-2">
                  H<Input id="homeScore" type="number" className="w-16 text-center" />
                  <span>-</span>
                  <Input id="awayScore" type="number" className="w-16 text-center" />A
                </div>
              </div>
            )}
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