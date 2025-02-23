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
import { useState } from "react"
import { format, parse } from "date-fns"

const AddGame = () => {
  const [date, setDate] = useState<Date>();
  const [inputTime, setInputTime] = useState<string>('');
  const [inputDate, setInputDate] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // TODO: Send a POST request to the backend with the new game data
    const form = e.target as HTMLFormElement;
    const homeTeam = form.homeTeam.value;
    const awayTeam = form.awayTeam.value;
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

    console.log(homeTeam, awayTeam, combinedDateTime);    
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Image src="/icons/plus.svg" alt="Lisää peli" width={20} height={20} />
                    Lisää peli
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Lisää peli</DialogTitle>
          <DialogDescription>
            Syötä pelin tiedot
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
              <Input id="homeTeam"  className="col-span-3" />
              {errors.homeTeam && <p className="text-red-500 text-sm col-span-4 text-center">{errors.homeTeam}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="awayTeam" className="text-right">
                Vierasjoukkue
              </Label>
              <Input id="awayTeam" className="col-span-3" />
              {errors.awayTeam && <p className="text-red-500 text-sm col-span-4 text-center">{errors.awayTeam}</p>}
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
              <Button type="button" variant="secondary" className="max-w-[fit-content]">
                Sulje
              </Button>
            </DialogClose>
            <Button type="submit" className="max-w-[fit-content]">Lisää peli</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddGame
