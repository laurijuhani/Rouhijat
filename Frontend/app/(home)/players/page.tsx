import { Goalie, Player } from "@/types/database_types";
import List from "./list";

const fetchPlayers = async () => {
  try {
   const res = await fetch(`${process.env.INTERNAL_BACKEND_URL}/players`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch players");
    }

    const data: Player[] = await res.json();


    return data.sort((a, b) => {
      if (a.number === null && b.number === null) return 0;
      if (a.number === null) return 1;
      if (b.number === null) return -1;
      return a.number - b.number;
    }); 
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}; 

const fetchGoalies = async () => {
  try {
   const res = await fetch(`${process.env.INTERNAL_BACKEND_URL}/goalies`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch players");
    }

    const data: Goalie[] = await res.json();
    return data.sort((a, b) => {
      if (a.number === null && b.number === null) return 0;
      if (a.number === null) return 1;
      if (b.number === null) return -1;
      return a.number - b.number;
    });
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}; 



const Page = async () => {
  let players: Player[] = [];
  let goalies: Goalie[] = [];
  
    try {
      players = await fetchPlayers();
      goalies = await fetchGoalies();
    } catch (error) {
      console.error("Error fetching players:", error);
      return (
        <div className="w-3/4 h-3 mx-auto">
          <p className="text-center text-2xl">Failed to load players</p>
        </div>
      );
    }
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">Pelaajat</h1>
      <List players={players} isGoalie={false} />  
      <h1 className="text-3xl font-bold mb-2 mt-4">Maalivahdit</h1>
      <List players={goalies} isGoalie={true} />
    </div>
  );
};

export default Page;
