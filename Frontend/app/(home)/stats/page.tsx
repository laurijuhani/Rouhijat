import { Player } from "@/types/database_types";
import { DataTable } from "./data-table";
import { columns } from "./columns";


const fetchPlayers = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/players`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') }, 
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}


const Stats = async () => {
  const players: Player[] = await fetchPlayers();
  players.sort((a, b) => a.number - b.number);

  return (
    <div>
      <DataTable columns={columns} data={players} />
    </div>
  )
}

export default Stats
