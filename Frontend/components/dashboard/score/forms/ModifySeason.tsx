import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Season } from "@/types/database_types";
import { useState } from "react";

interface ModifySeasonProps {
  season: Season;
  handleActiveSeasonChange: (season: Season) => Promise<void>;
  setSeasons: React.Dispatch<React.SetStateAction<Season[]>>;
}

const ModifySeason = ({ season, handleActiveSeasonChange, setSeasons }: ModifySeasonProps) => {
  const [seasonName, setSeasonName] = useState(season.name);

  const handleSeasonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeasonName(e.target.value);
  };


  const handleSeasonNameUpdate = async () => {
    if (window.confirm(`Haluatko varmasti muuttaa kauden "${season.name}" nimeksi "${seasonName}"?`)) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/seasons/${season.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: seasonName }),
      });
      if (res.ok) {
        setSeasonName(seasonName);
        setSeasons((prevSeasons) =>
          prevSeasons.map((s) => (s.id === season.id ? { ...s, name: seasonName } : s))
        );
      } else {
        throw new Error('Failed to update season name');
      }
    }
  };


  return (
    <div className="flex justify-between items-center p-2 border-p">
      <Label>
        {season.active ? "Aktiivinen" : 
        <Button
        variant="outline"
        onClick={() => handleActiveSeasonChange(season)}>
            Aseta
        </Button>}
      </Label>
      <Input
        id={`season-${season.id}`}
        value={seasonName}
        className="flex-1 mx-2"
        onChange={handleSeasonNameChange}
        />

        {season.name !== seasonName.trim() && (
          <Button variant="outline" onClick={handleSeasonNameUpdate}>Muokkaa</Button>
        )}
    </div>
  );
};

export default ModifySeason;
