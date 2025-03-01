import { Player } from "@/types/database_types";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const Stats = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`, {
    next: { revalidate: 6 }, // TODO: Modify this to 10 minutes in production
  });
  const players: Player[] = await res.json();
  players.sort((a, b) => a.number - b.number);

  return (
    <div>
      <DataTable columns={columns} data={players} />
    </div>
  )
}

export default Stats
