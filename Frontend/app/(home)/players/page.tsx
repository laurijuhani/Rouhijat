import { Player } from "@/types/database_types";
import List from "./list";

const fetchPlayers = async () => {
  try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/players`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch players");
    }
    return res.json(); 
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}; 



const Page = async () => {
  let players: Player[] = [];
  
    try {
      players = await fetchPlayers();
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
      <List players={players} />  
    </div>
  );
};

export default Page;
