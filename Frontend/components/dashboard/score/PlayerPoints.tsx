import { Checkbox } from "@/components/ui/checkbox"; // Ensure Checkbox component accepts the correct event type
import { Player } from "@/types/database_types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PlayerPointsProps {
  player: Player;
  playerPoints: { [key: number]: [number, number, number] };
  setPlayerPoints: React.Dispatch<React.SetStateAction<{ [key: number]: [number, number, number] }>>;
}

const PlayerPoints = ({ player, playerPoints, setPlayerPoints }: PlayerPointsProps) => {
  const [isChecked, setIsChecked] = useState(playerPoints[player.id] ? true : false);

  const handleCheckboxChange = (checked: boolean) => {
    const newPlayerPoints = { ...playerPoints };
    if (checked) {
      newPlayerPoints[player.id] = [0, 0, 0];
    } else {
      delete newPlayerPoints[player.id];
    }
    setPlayerPoints(newPlayerPoints);
    setIsChecked(checked);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const points = parseInt(e.target.value, 10) || 0;
    setPlayerPoints((prev) => ({
      ...prev,
      [player.id]: [
        index === 0 ? points : prev[player.id]?.[0] || 0,
        index === 1 ? points : prev[player.id]?.[1] || 0,
        index === 2 ? points : prev[player.id]?.[2] || 0,
      ],
    }));
  };
 
 
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={`player-${player.id}-name`} className="text-right">
        {player.name}
      </Label>
      <div className="col-span-3 flex items-center gap-5">
        <Checkbox id={`player-${player.id}-checkbox`} 
          checked={isChecked} 
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)} 
        />
        <Input
          id={`player-${player.id}-goals`}
          type="number"
          value={playerPoints[player.id]?.[0] || ''}
          onChange={(e) => handlePointsChange(e, 0)}
          disabled={!isChecked}
          className="col-span-1"
        />
        <Input
          id={`player-${player.id}-assists`}
          type="number"
          value={playerPoints[player.id]?.[1] || ''}
          onChange={(e) => handlePointsChange(e, 1)}
          disabled={!isChecked}
          className="col-span-1"
        />
        <Input
          id={`player-${player.id}-pm`}
          type="number"
          value={playerPoints[player.id]?.[2] || ''}
          onChange={(e) => handlePointsChange(e, 2)}
          disabled={!isChecked}
          className="col-span-1"
        />
      </div>
    </div>
  );
};

export default PlayerPoints;
