'use client';

import SeasonSelector from "@/components/basics/SeasonSelector";
import Spinner from "@/components/basics/Spinner";
import { Player, Season } from "@/types/database_types";
import Fetch from "@/utils/fetch";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";



interface BodyProps {
  seasons: Season[];
}


const Body = ({ seasons }: BodyProps) => {
  const [playersCache, setPlayersCache] = useState<Record<string, Player[]>>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlayersBySeason = async (seasonId: string) => {
    setLoading(true);
    if (playersCache[seasonId]) {
      setPlayers(playersCache[seasonId]);
      setLoading(false);
      return;
    }

    try {
      const fetchedPlayers = await Fetch.get<Player[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/players/season/${seasonId}`,
      );
      fetchedPlayers.sort((a, b) => a.number - b.number);
      setPlayersCache((prev) => ({ ...prev, [seasonId]: fetchedPlayers }));
      setPlayers(fetchedPlayers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching players:", error);
      setLoading(false);
      return [];
    }
  };

  const handleSeasonChange = (seasonId: string) => {
    const selectedSeason = seasons.find((season) => season.id.toString() === seasonId);
    if (selectedSeason) {
      fetchPlayersBySeason(seasonId);
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
        <div className="mt-4">
          <DataTable columns={columns} data={players} />
        </div>
      )}
    </>
  );
};

export default Body;
