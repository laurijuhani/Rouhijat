import { Game } from "@/types/database_types";

const fetchGames = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/games`, {
    next: { revalidate: 6 }, // Revalidate every 6 seconds
  });
  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }
  return res.json();
};


const GameTable = () => {
  return (
    <div>
      
    </div>
  )
}

export default GameTable
