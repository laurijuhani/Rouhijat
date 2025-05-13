import { Goalie } from "@/types/database_types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GoalieSelectorProps {
  goalies: Goalie[];
  selectedGoalie: Goalie | null;
  setSelectedGoalie: React.Dispatch<React.SetStateAction<Goalie | null>>;
}


const GoalieSelector = ({ goalies, selectedGoalie, setSelectedGoalie}: GoalieSelectorProps) => {
  const handleGoalieChange = (goalieId: string) => {
    const goalie = goalies.find((goalie) => goalie.id.toString() === goalieId);
    setSelectedGoalie(goalie || null);
  };

  return (
    <div className="*:not-first:mt-2">
      <Select defaultValue={selectedGoalie?.id.toString()} onValueChange={handleGoalieChange}>
        <SelectTrigger id="goalies" >
        {selectedGoalie ? (
            <span>{selectedGoalie.name}</span> 
          ) : (
            <SelectValue placeholder="Valitse maalivahti" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null" onClick={() => setSelectedGoalie(null)} className="bg-background hover:bg-accent hover:text-accent-foreground">
            Ei maalivahtia
          </SelectItem>
          {goalies.map((goalie) => (
            <SelectItem key={goalie.id} value={goalie.id.toString()} onClick={() => setSelectedGoalie(goalie)} className="bg-background hover:bg-accent hover:text-accent-foreground">
              {goalie.name}
            </SelectItem>
          ))}
          
        </SelectContent>
      </Select>
      
    </div>
  );
};

export default GoalieSelector;
