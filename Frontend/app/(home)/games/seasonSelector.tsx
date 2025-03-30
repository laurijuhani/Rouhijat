'use client';

import Spinner from "@/components/basics/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Game, Season } from "@/types/database_types";
import { useEffect, useState } from "react";
import Tab from "./tab";

interface SelectorProps {
  seasons: Season[];
}

const defaultSeason = (seasons: Season[]) => {
  const currentSeason = seasons.find((season) => season.active);
  return currentSeason ? currentSeason.id.toString() : "";
}; 


const SeasonSelector = ({ seasons }: SelectorProps) => {
  const [gameCache, setgameCache] = useState<Record<string, Game[]>>({});
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGamesBySeason = async (seasonId: string) => {

    setLoading(true);
    if (gameCache[seasonId]) {
      setGames(gameCache[seasonId]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/season/${seasonId}`,
      );
      
      if (!res.ok) {
        throw new Error("Failed to fetch games");
      }
      const fetchedGames = await res.json();
      
      setgameCache((prev) => ({ ...prev, [seasonId]: fetchedGames }));
      setGames(fetchedGames);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching games:", error);
      setLoading(false);
      return [];      
    }

  };

  const handleSeasonChange = (seasonId: string) => {
    const selectedSeason = seasons.find((season) => season.id.toString() === seasonId);
    if (selectedSeason) {      
      fetchGamesBySeason(seasonId);
    }
  };

  // Only run this effect once when the component mounts
  useEffect(() => {
    if (seasons.length > 0) {
      const currentSeason = seasons.find((season) => season.active);
      handleSeasonChange(currentSeason!.id.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <div className="*:not-first:mt-2">
        <Select defaultValue={defaultSeason(seasons)} onValueChange={handleSeasonChange}>
          <SelectTrigger
            className="bg-muted border-transparent shadow-none"
            >
            <SelectValue placeholder="Valitse kausi" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem
              key={season.id}
              value={season.id.toString()}
              className="bg-muted border-transparent shadow-none"
              >
                {season.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Spinner className="flex justify-center items-center mt-3" />
      ) : (
        games.length === 0 ? (
          <div className="w-3/4 h-3 mx-auto">
            <p className="text-center text-2xl">Ei pelejä</p>
          </div>
        ) : (
          <Tab games={games} />
        )
      )}
    </>
  );
};

export default SeasonSelector;