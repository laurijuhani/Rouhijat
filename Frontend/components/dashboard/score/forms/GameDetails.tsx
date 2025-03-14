import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Game } from "@/types/database_types"
import { cn } from "@/lib/utils"

interface GameDetailsProps {
  game: Game;
  played: boolean;
  inputDate: string;
  inputTime: string;
  date: Date | undefined;
  errors: { [key: string]: string };
  handleDateInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (date: Date | undefined) => void;
}


const GameDetails = ({ game, played, inputDate, inputTime, date, errors, handleDateInputChange, handleTimeInputChange, handleDateChange}: GameDetailsProps) => {
  return (
    <>
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
      <div className="grid grid-cols-6 items-center gap-4">
        <Label htmlFor="homeTeam" className="text-right col-span-2">
          Kotijoukkue
        </Label>
        <Input id="homeTeam"  className="col-span-4" defaultValue={game.homeTeam}/>
        {errors.homeTeam && <p className="text-red-500 text-sm col-span-4 text-center">{errors.homeTeam}</p>}
      </div>
      <div className="grid grid-cols-6 items-center gap-4">
        <Label htmlFor="awayTeam" className="text-right col-span-2">
          Vierasjoukkue
        </Label>
        <Input id="awayTeam" className="col-span-4" defaultValue={game.awayTeam}/>
        {errors.awayTeam && <p className="text-red-500 text-sm col-span-4 text-center">{errors.awayTeam}</p>}
      </div>
      {played && 
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="score" className="text-center col-span-4">
            Tulos
          </Label>
        <div className="col-span-4 flex justify-center items-center gap-2">
          H<Input id="homeScore" type="number" defaultValue={game.homeScore || 0} className="w-16 text-center" />
          <span>-</span>
          <Input id="awayScore" type="number" defaultValue={game.awayScore || 0} className="w-16 text-center" />A
        </div>
        </div>
      }
    </>
  )
}

export default GameDetails
