import { Season } from "@/types/database_types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeasonSelectorProps {
  seasons: Season[]; 
  selectedSeason: Season | null;
  setSelectedSeason: React.Dispatch<React.SetStateAction<Season | null>>;
}




const SeasonSelector = ({ seasons, selectedSeason, setSelectedSeason }: SeasonSelectorProps) => {
  const handleSeasonChange = (seasonId: string) => {
    const season = seasons.find((season) => season.id.toString() === seasonId);
    setSelectedSeason(season || null);
  };
  return (
    <div className="*:not-first:mt-2">
      <Select defaultValue={selectedSeason?.id.toString()} onValueChange={handleSeasonChange} >
        <SelectTrigger id="seasons">
        {selectedSeason ? (
            <span>{selectedSeason.name}</span> 
          ) : (
            <SelectValue placeholder="Valitse kausi" />
          )}
        </SelectTrigger>
        <SelectContent>
          {seasons.map((season) => (
            <SelectItem key={season.id} value={season.id.toString()} onClick={() => setSelectedSeason(season)}>
              {season.name}
            </SelectItem>
          ))}
          
        </SelectContent>
      </Select>
      
    </div>
  );
};

export default SeasonSelector;
