import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Season } from "@/types/database_types";


interface SeasonsFormProps {
  seasons: Season[];
  setSeasons: React.Dispatch<React.SetStateAction<Season[]>>;
}


const SeasonsForm = ({ seasons, setSeasons }: SeasonsFormProps) => {
  
  
  const handleAddSeason = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const seasonName = form.seasonName.value.trim();
    if (seasonName) {
      if (!window.confirm(`Haluatko varmasti lisätä kauden "${seasonName}"?`)) return; 

      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/seasons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: seasonName }),
      });
      if (res.ok) {
        const newSeason: Season = await res.json();
        newSeason.active = false; // Set the new season as inactive by default
        setSeasons([...seasons, newSeason]);
        form.reset();
        return;
      }
      throw new Error('Failed to add season');
    }
  };


  const handleActiveSeasonChange = async (season: Season) => {
    if (window.confirm(`Haluatko varmasti vaihtaa aktiivisen kauden "${season.name}"?`)) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/seasons/current`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ id: season.id }),
      });
      if (res.ok) {
        setSeasons(seasons.map(s => ({ ...s, active: s.id === season.id })));
      } else {
        throw new Error('Failed to update season');
      }
    }
  }; 

  const handleModifySeasonName = async (season: Season) => {
    // TODO: implement this
  };



  return (
    <Sheet key="bottom">
      <SheetTrigger asChild>
        <Button variant="outline">Muokkaa kausia</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Muokkaa kausia</SheetTitle>
        <SheetDescription>
            Lisää tai muokkaa kausia tai vaihda aktiivista kautta.
        </SheetDescription>
        </SheetHeader>
        <div className="mb-10">
          {seasons.map((season) => (
            <div key={season.id} className="flex justify-between items-center p-2 border-b">
              <Label htmlFor={`season-${season.id}`} className="text-right">
                {season.active ? "Aktiivinen" : 
                <Button 
                  variant="outline" 
                  onClick={() => handleActiveSeasonChange(season)}>
                    Aseta
                </Button>}
              </Label>
              <Input
                id={`season-${season.id}`}
                value={season.name}
                className="flex-1 mx-2"
              />
              <Button variant="outline">Muokkaa</Button>
            </div>
          ))}

          <form className="flex flex-col gap-2 mt-4" onSubmit={handleAddSeason}>
            <Label htmlFor="seasonName">Lisää kausi</Label>
            <div className="flex gap-2">
              <Input id="seasonName" placeholder="Kausi" className="flex-1"/>
              <Button variant="outline" type="submit">Lisää</Button>
            </div>
          </form>
          

        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" type="submit">Sulje</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SeasonsForm;
