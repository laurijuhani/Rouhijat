'use client';

import Spinner from "@/components/basics/Spinner";
import { Game, Season } from "@/types/database_types";
import { useEffect, useState } from "react";
import Tab from "./tab";
import Fetch from "@/utils/fetch";
import SeasonSelector from "@/components/basics/SeasonSelector";

interface SelectorProps {
  seasons: Season[];
}


const Selector = ({ seasons }: SelectorProps) => {
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
      const fetchedGames = await Fetch.get<Game[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/season/${seasonId}`,
      );

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
      <SeasonSelector 
        seasons={seasons}
        handleSeasonChange={handleSeasonChange}
      />
      
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

export default Selector;