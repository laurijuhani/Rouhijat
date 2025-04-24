import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Season } from "@/types/database_types";

interface SeasonSelectorProps {
  seasons: Season[];
  handleSeasonChange: (seasonId: string) => void;
}

const defaultSeason = (seasons: Season[]) => {
  const currentSeason = seasons.find((season) => season.active);
  return currentSeason ? currentSeason.id.toString() : "";
}; 

const SeasonSelector = ({ seasons, handleSeasonChange }: SeasonSelectorProps) => {
  if (seasons.length === 1) {
    return (
      <div className="mt-2 bg-primary border-transparent shadow-none rounded-md p-1.5">
        <span className="text-sm font-medium ml-1.5 ">{seasons[0].name}</span>
      </div>
    );
  }

  return (
    <div className="*:not-first:mt-2">
        <Select defaultValue={defaultSeason(seasons)} onValueChange={handleSeasonChange}>
          <SelectTrigger
            className="bg-primary border-transparent shadow-none"
            >
            <SelectValue placeholder="Valitse kausi" />
          </SelectTrigger>
          <SelectContent className="bg-primary border-transparent shadow-none">
            {seasons.map((season) => (
              <SelectItem
              key={season.id}
              value={season.id.toString()}
              className="bg-background border-transparent shadow-none"
              >
                {season.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
  );
};

export default SeasonSelector;
