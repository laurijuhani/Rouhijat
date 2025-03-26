import Tab from "./tab";
import { Game } from "@/types/database_types";

const fetchGames = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/games`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch games");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

const Page = async  () => {
  let games: Game[] = [];
  
    try {
      games = await fetchGames();
    } catch (error) {
      console.error("Error fetching games:", error);
      return (
        <div className="w-3/4 h-3 mx-auto">
          <p className="text-center text-2xl">Failed to load games</p>
        </div>
      );
    }
  
    if (games.length === 0) {
      return (
        <div className="w-3/4 h-3 mx-auto">
          <p className="text-center text-2xl">Ei pelejä</p>
        </div>  
      );
    }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">Rouhijoiden ottelut</h1>

      <Tab games={games}/>

   
    </div>
  );
};

export default Page;
