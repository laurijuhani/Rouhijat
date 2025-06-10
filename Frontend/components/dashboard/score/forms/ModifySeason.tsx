import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Season } from "@/types/database_types";
import Fetch from "@/utils/fetch";
import { useState } from "react";
import Cookies from "js-cookie";

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
      try {
        await Fetch.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/seasons/${season.id}`,
          { name: seasonName },
          {
            Authorization: `Bearer ${Cookies.get('token')}`,
          }
        );
        setSeasonName(seasonName);
        setSeasons((prevSeasons) =>
          prevSeasons.map((s) => (s.id === season.id ? { ...s, name: seasonName } : s))
        );
      } catch (error) {
        console.error("Error updating season name:", error);
        alert("Kauden nimeä ei voitu muuttaa.");
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
